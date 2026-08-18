using CloudServices.Application.Common.Exceptions;
using FluentValidation;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace CloudServices.API.Middleware;

public class CustomExceptionHandler : IExceptionHandler
{
    private readonly ILogger<CustomExceptionHandler> _logger;

    public CustomExceptionHandler(ILogger<CustomExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        _logger.LogError(exception, "Đã xảy ra lỗi: {Message}", exception.Message);

        var problemDetails = new ProblemDetails();

        switch (exception)
        {
            // 1. Lỗi Validation (Dữ liệu đầu vào không hợp lệ) -> Trả về 400 Bad Request
            case ValidationException validationException:
                httpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                problemDetails.Status = (int)HttpStatusCode.BadRequest;
                problemDetails.Title = "Yêu cầu không hợp lệ (Validation Error)";
                problemDetails.Detail = "Một hoặc nhiều trường dữ liệu không hợp lệ.";

                var errors = new Dictionary<string, string[]>();
                foreach (var failure in validationException.Errors)
                {
                    if (errors.ContainsKey(failure.PropertyName))
                    {
                        var list = new List<string>(errors[failure.PropertyName]) { failure.ErrorMessage };
                        errors[failure.PropertyName] = list.ToArray();
                    }
                    else
                    {
                        errors[failure.PropertyName] = new[] { failure.ErrorMessage };
                    }
                }
                problemDetails.Extensions["errors"] = errors;
                break;

            // 2. Lỗi Unauthorized (Sai mật khẩu, tài khoản...) -> Trả về 401 Unauthorized
            case UnauthorizedException unauthorizedException:
                httpContext.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                problemDetails.Status = (int)HttpStatusCode.Unauthorized;
                problemDetails.Title = "Không có quyền truy cập (Unauthorized)";
                problemDetails.Detail = unauthorizedException.Message;
                break;

            // 3. Lỗi Không tìm thấy tài nguyên -> Trả về 404 Not Found
            case NotFoundException notFoundException:
                httpContext.Response.StatusCode = (int)HttpStatusCode.NotFound;
                problemDetails.Status = (int)HttpStatusCode.NotFound;
                problemDetails.Title = "Không tìm thấy tài nguyên (Not Found)";
                problemDetails.Detail = notFoundException.Message;
                break;

            // 4. Các lỗi hệ thống khác -> Trả về 500 Internal Server Error
            default:
                httpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                problemDetails.Status = (int)HttpStatusCode.InternalServerError;
                problemDetails.Title = "Lỗi máy chủ nội bộ (Internal Server Error)";
                problemDetails.Detail = "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.";
                break;
        }

        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);
        return true;
    }
}