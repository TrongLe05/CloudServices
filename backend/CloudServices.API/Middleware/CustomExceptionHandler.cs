using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Exceptions.BadRequestException;
using FluentValidation;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

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
        var problemDetails = new ProblemDetails();

        switch (exception)
        {
            // 1. Lỗi Validation (Dữ liệu đầu vào không hợp lệ) -> Trả về 400 Bad Request
            case ValidationException validationException:
                _logger.LogWarning("Lỗi Validation: {Message}", validationException.Message);
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

            // 2. Lỗi BadRequestException (Business rule validation) -> Trả về 400 Bad Request
            case BadRequestException badRequestException:
                _logger.LogWarning("Lỗi Yêu cầu không hợp lệ: {Message}", badRequestException.Message);
                httpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                problemDetails.Status = (int)HttpStatusCode.BadRequest;
                problemDetails.Title = "Yêu cầu không hợp lệ (Bad Request)";
                problemDetails.Detail = badRequestException.Message;
                break;

            // 3. Lỗi Unauthorized (Hết hạn phiên, sai token, tài khoản bị khóa...) -> Trả về 401 Unauthorized
            case UnauthorizedException unauthorizedException:
                _logger.LogWarning("Xác thực không thành công: {Message}", unauthorizedException.Message);
                httpContext.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                problemDetails.Status = (int)HttpStatusCode.Unauthorized;
                problemDetails.Title = "Chưa xác thực (Unauthorized)";
                problemDetails.Detail = unauthorizedException.Message;
                break;

            // 4. Lỗi Forbidden (Không đủ quyền hạn truy cập tài nguyên) -> Trả về 403 Forbidden
            case ForbiddenAccessException forbiddenException:
                _logger.LogWarning("Không đủ quyền truy cập: {Message}", forbiddenException.Message);
                httpContext.Response.StatusCode = (int)HttpStatusCode.Forbidden;
                problemDetails.Status = (int)HttpStatusCode.Forbidden;
                problemDetails.Title = "Không có quyền truy cập (Forbidden)";
                problemDetails.Detail = forbiddenException.Message;
                break;

            // 5. Lỗi Không tìm thấy tài nguyên -> Trả về 404 Not Found
            case NotFoundException notFoundException:
                _logger.LogWarning("Không tìm thấy tài nguyên: {Message}", notFoundException.Message);
                httpContext.Response.StatusCode = (int)HttpStatusCode.NotFound;
                problemDetails.Status = (int)HttpStatusCode.NotFound;
                problemDetails.Title = "Không tìm thấy tài nguyên (Not Found)";
                problemDetails.Detail = notFoundException.Message;
                break;

            case KeyNotFoundException keyNotFoundException:
                _logger.LogWarning("Không tìm thấy khóa tài nguyên: {Message}", keyNotFoundException.Message);
                httpContext.Response.StatusCode = (int)HttpStatusCode.NotFound;
                problemDetails.Status = (int)HttpStatusCode.NotFound;
                problemDetails.Title = "Không tìm thấy tài nguyên (Not Found)";
                problemDetails.Detail = keyNotFoundException.Message;
                break;

            // 6. Các lỗi hệ thống không mong muốn -> Trả về 500 Internal Server Error & LogError
            default:
                _logger.LogError(exception, "Đã xảy ra lỗi hệ thống nghiêm trọng: {Message}", exception.Message);
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