using CloudServices.Domain.Entities;
using System.Security.Claims;

namespace CloudServices.Application.Common.Interfaces;

public interface IJwtTokenGenerator
{
    // Tạo Access Token chứa các Claim (thông tin User, Role...)
    string GenerateToken(AppUser user);

    // Tạo chuỗi ngẫu nhiên làm Refresh Token
    string GenerateRefreshToken();
    ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
}
