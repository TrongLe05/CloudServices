using System.Diagnostics;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using CloudServices.Domain.Entities;
using CloudServices.Infrastructure.Data;

namespace CloudServices.API.Middleware;

public class AuditLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<AuditLoggingMiddleware> _logger;

    public AuditLoggingMiddleware(RequestDelegate next, ILogger<AuditLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context, ApplicationDbContext dbContext)
    {
        var path = context.Request.Path.Value ?? string.Empty;

        // Bỏ qua các endpoint tài liệu API, file tĩnh và chính API audit-logs
        if (ShouldSkipPath(path))
        {
            await _next(context);
            return;
        }

        var stopwatch = Stopwatch.StartNew();

        // 1. Đọc Payload của request (nếu có)
        string? requestPayload = null;
        if (context.Request.ContentLength > 0 && context.Request.ContentType?.Contains("application/json") == true)
        {
            context.Request.EnableBuffering();
            using var reader = new StreamReader(context.Request.Body, Encoding.UTF8, leaveOpen: true);
            var rawBody = await reader.ReadToEndAsync();
            context.Request.Body.Position = 0;

            requestPayload = MaskSensitiveData(rawBody);
        }
        else if (context.Request.QueryString.HasValue)
        {
            requestPayload = context.Request.QueryString.Value;
        }

        string? errorMessage = null;

        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            errorMessage = ex.Message;
            throw;
        }
        finally
        {
            stopwatch.Stop();

            try
            {
                // Trích xuất thông tin người dùng từ JWT Claims
                var userIdClaim = context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                Guid? userId = Guid.TryParse(userIdClaim, out var uid) ? uid : null;

                var username = context.User?.FindFirst(ClaimTypes.Name)?.Value 
                    ?? context.User?.FindFirst(ClaimTypes.Email)?.Value 
                    ?? (context.User?.Identity?.IsAuthenticated == true ? context.User.Identity.Name : "Khách vãng lai");

                var userRole = context.User?.FindFirst(ClaimTypes.Role)?.Value;

                var ipAddress = context.Request.Headers["X-Forwarded-For"].FirstOrDefault() 
                    ?? context.Connection.RemoteIpAddress?.ToString();

                var userAgent = context.Request.Headers.UserAgent.ToString();
                if (userAgent.Length > 500) userAgent = userAgent[..500];

                var statusCode = context.Response.StatusCode;
                var isSuccess = statusCode >= 200 && statusCode < 400;

                var category = ResolveCategory(path);
                var actionName = ResolveActionName(context.Request.Method, path);

                var log = new AuditLog
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    Username = string.IsNullOrWhiteSpace(username) ? "Khách vãng lai" : username,
                    UserRole = userRole,
                    Category = category,
                    Action = actionName,
                    HttpMethod = context.Request.Method,
                    Path = path.Length > 500 ? path[..500] : path,
                    StatusCode = statusCode,
                    IsSuccess = isSuccess,
                    ExecutionDurationMs = stopwatch.ElapsedMilliseconds,
                    IpAddress = ipAddress,
                    UserAgent = userAgent,
                    Payload = requestPayload,
                    ErrorMessage = errorMessage,
                    Timestamp = DateTime.UtcNow
                };

                // Ghi log cấu trúc thông qua Serilog
                _logger.LogInformation(
                    "[Serilog AuditLog] Phân loại={Category} | Hành động={Action} | User={Username} ({UserRole}) | Method={HttpMethod} | Path={Path} | Status={StatusCode} | Duration={Duration}ms | IP={IpAddress}",
                    category, actionName, log.Username, userRole ?? "N/A", context.Request.Method, path, statusCode, stopwatch.ElapsedMilliseconds, ipAddress);

                dbContext.AuditLogs.Add(log);
                await dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lưu AuditLog hệ thống.");
            }
        }
    }

    private static bool ShouldSkipPath(string path)
    {
        if (string.IsNullOrWhiteSpace(path)) return true;

        var lowerPath = path.ToLowerInvariant();
        return lowerPath.StartsWith("/scalar") ||
               lowerPath.StartsWith("/openapi") ||
               lowerPath.StartsWith("/swagger") ||
               lowerPath.StartsWith("/api/audit-logs") ||
               lowerPath.EndsWith(".ico") ||
               lowerPath.EndsWith(".png") ||
               lowerPath.EndsWith(".jpg") ||
               lowerPath.EndsWith(".svg") ||
               lowerPath.EndsWith(".css") ||
               lowerPath.EndsWith(".js");
    }

    private static string MaskSensitiveData(string rawJson)
    {
        if (string.IsNullOrWhiteSpace(rawJson)) return rawJson;

        try
        {
            // Thay thế các trường nhạy cảm bằng "******"
            var pattern = @"(?i)""(password|confirmPassword|token|secretKey|accessToken|refreshToken|oldPassword|newPassword)""\s*:\s*""([^""]*)""";
            return Regex.Replace(rawJson, pattern, @"""$1"": ""******""");
        }
        catch
        {
            return "[Masked Data]";
        }
    }

    private static string ResolveActionName(string method, string path)
    {
        var p = path.ToLowerInvariant();
        var m = method.ToUpperInvariant();

        // 1. Auth & Người dùng
        if (p.Contains("/auth/login")) return "Đăng nhập hệ thống";
        if (p.Contains("/auth/register")) return "Đăng ký tài khoản";
        if (p.Contains("/auth/forgot-password")) return "Yêu cầu quên mật khẩu";
        if (p.Contains("/auth/reset-password")) return "Đặt lại mật khẩu";
        if (p.Contains("/auth/verify-otp")) return "Xác thực mã OTP";
        if (p.Contains("/users/me")) return "Xem thông tin cá nhân";

        // 2. Yêu cầu đặt dịch vụ (Order Requests)
        if (p.Contains("/order-requests"))
        {
            if (m == "POST") return "Đặt dịch vụ mới";
            if (m == "PATCH" && p.Contains("/status")) return "Cập nhật trạng thái đơn hàng";
            if (m == "DELETE") return "Xóa yêu cầu đặt dịch vụ";
            if (p.Contains("/export")) return "Xuất Excel danh sách đơn hàng";
            if (m == "GET") return "Xem danh sách yêu cầu dịch vụ";
        }

        // 3. Thanh toán (Payments)
        if (p.Contains("/payments/create-payos-link")) return "Tạo liên kết thanh toán PayOS";
        if (p.Contains("/payments/status")) return "Kiểm tra trạng thái thanh toán PayOS";

        // 4. Gói dịch vụ & Giá (Service Plans)
        if (p.Contains("/service-plans"))
        {
            if (p.Contains("/qr-code/regenerate")) return "Tạo lại mã QR gói dịch vụ";
            if (p.Contains("/qr-code")) return "Xem mã QR gói dịch vụ";
            if (p.Contains("/prices") && m == "POST") return "Thêm giá gói dịch vụ";
            if (p.Contains("/prices") && m == "PUT") return "Cập nhật giá gói dịch vụ";
            if (p.Contains("/prices") && m == "DELETE") return "Xóa giá gói dịch vụ";
            if (m == "POST") return "Tạo gói dịch vụ mới";
            if (m == "PUT") return "Cập nhật gói dịch vụ";
            if (m == "DELETE") return "Xóa gói dịch vụ";
            if (m == "GET") return "Xem danh mục gói dịch vụ";
        }

        // 5. Danh mục dịch vụ (Service Categories)
        if (p.Contains("/service-categories"))
        {
            if (m == "POST") return "Thêm danh mục dịch vụ";
            if (m == "PUT") return "Cập nhật danh mục dịch vụ";
            if (m == "DELETE") return "Xóa danh mục dịch vụ";
            if (m == "GET") return "Xem danh sách danh mục dịch vụ";
        }

        // 6. Khuyến mãi (Promotions)
        if (p.Contains("/promotions"))
        {
            if (m == "POST") return "Tạo chương trình khuyến mãi";
            if (m == "PUT") return "Cập nhật chương trình khuyến mãi";
            if (m == "DELETE") return "Xóa chương trình khuyến mãi";
            if (m == "GET") return "Xem chương trình khuyến mãi";
        }

        // 7. Tin tức & Blog (News)
        if (p.Contains("/news"))
        {
            if (m == "POST") return "Đăng bài viết tin tức";
            if (m == "PUT") return "Chỉnh sửa bài viết tin tức";
            if (m == "DELETE") return "Xóa bài viết tin tức";
            if (m == "GET") return "Xem bài viết tin tức";
        }

        // 8. Affiliate
        if (p.Contains("/affiliates"))
        {
            if (p.Contains("/export")) return "Xuất file Excel danh sách Affiliate";
            if (p.Contains("/status")) return "Cập nhật trạng thái duyệt Affiliate";
            if (m == "POST") return "Nộp đơn đăng ký Affiliate";
            if (m == "GET") return "Xem danh sách đăng ký Affiliate";
        }

        // 9. Thống kê (Statistics)
        if (p.Contains("/statistics/dashboard")) return "Xem tổng quan thống kê Dashboard";
        if (p.Contains("/statistics/orders")) return "Xem biểu đồ thống kê đơn hàng";
        if (p.Contains("/statistics/popular-plans")) return "Xem thống kê gói dịch vụ phổ biến";

        return $"{method} {path}";
    }

    private static string ResolveCategory(string path)
    {
        if (string.IsNullOrWhiteSpace(path)) return "Hệ Thống";
        var p = path.ToLowerInvariant();

        if (p.Contains("/auth") || p.Contains("/users")) return "Bảo mật";
        if (p.Contains("/service-plans") || p.Contains("/service-categories") || p.Contains("/promotions")) return "Gói Cước & Giá";
        if (p.Contains("/order-requests") || p.Contains("/payments") || p.Contains("/affiliates")) return "Đơn Hàng & CTV";
        if (p.Contains("/news")) return "Tin Tức";

        return "Hệ Thống";
    }
}
