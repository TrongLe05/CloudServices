using System.Security.Claims;
using CloudServices.Application.Common.Interfaces;
using Microsoft.AspNetCore.Http;

namespace CloudServices.Infrastructure.Services;

public sealed class CurrentUserService(
    IHttpContextAccessor httpContextAccessor
) : ICurrentUserService
{
    private HttpContext? HttpContext => httpContextAccessor.HttpContext;

    public Guid? UserId
    {
        get
        {
            var userIdStr = HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? HttpContext?.User?.FindFirst("sub")?.Value
                ?? HttpContext?.User?.FindFirst("id")?.Value;

            return Guid.TryParse(userIdStr, out var userId) ? userId : null;
        }
    }

    public string? Username
    {
        get
        {
            var user = HttpContext?.User;
            if (user == null || user.Identity?.IsAuthenticated != true)
            {
                return "Anonymous";
            }

            return user.FindFirst(ClaimTypes.Name)?.Value
                ?? user.FindFirst(ClaimTypes.Email)?.Value
                ?? user.Identity.Name
                ?? "Anonymous";
        }
    }

    public string? UserRole =>
        HttpContext?.User?.FindFirst(ClaimTypes.Role)?.Value
        ?? HttpContext?.User?.FindFirst("role")?.Value;

    public string? IpAddress
    {
        get
        {
            if (HttpContext == null) return null;

            var forwardedFor = HttpContext.Request.Headers["X-Forwarded-For"].FirstOrDefault();
            if (!string.IsNullOrWhiteSpace(forwardedFor))
            {
                // In case of multiple IPs in header (client, proxy1, proxy2), take the first one
                return forwardedFor.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).FirstOrDefault();
            }

            return HttpContext.Connection.RemoteIpAddress?.ToString();
        }
    }

    public string? UserAgent => HttpContext?.Request.Headers.UserAgent.ToString();
}
