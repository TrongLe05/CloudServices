using CloudServices.Application.Features.Users.Commands.Login;
using CloudServices.Application.Features.Users.Commands.Logout;
using CloudServices.Application.Features.Users.Commands.RefreshToken;
using CloudServices.Application.Features.Users.Commands.RegisterUser;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CloudServices.API.Controllers;

public class AuthController : ApiControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterUserCommand command)
    {
        var userId = await Mediator.Send(command);
        return Ok(new { UserId = userId });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginCommand command)
    {
        var response = await Mediator.Send(command);

     
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,             // 🔴 Quan trọng nhất: Chặn Javascript truy cập (chống XSS)
            Secure = true,               // 🔒 Bắt buộc dùng HTTPS (trình duyệt chỉ gửi cookie qua kênh bảo mật)
            SameSite = SameSiteMode.None, // 🌐 Cho phép gửi cookie chéo domain (nếu Frontend và API khác domain/port)
            Expires = DateTime.UtcNow.AddDays(7) // 🕒 Hết hạn trùng với thời gian sống của Refresh Token (7 ngày)
        };

        Response.Cookies.Append("refreshToken", response.RefreshToken, cookieOptions);
        return Ok(new
        {
            AccessToken = response.AccessToken,
            Username = response.Username
        });
    }

    [HttpPost("logout")]
    [Authorize] // Chỉ cho phép người dùng đã đăng nhập thực hiện logout
    public async Task<IActionResult> Logout(CancellationToken cancellationToken)
    {
        // Trích xuất User ID từ JWT Claim NameIdentifier (hoặc Sub)
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                          ?? User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;

        if (string.IsNullOrEmpty(userIdClaim))
        {
            return Unauthorized();
        }

        var userId = Guid.Parse(userIdClaim);

        // Gửi lệnh logout sang Mediator
        await Mediator.Send(new LogoutCommand(userId), cancellationToken);

        return NoContent(); // Trả về HTTP 204 No Content báo thành công
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshRequestDto request)
    {
        // Kiểm tra refresh token từ Cookie 
        if (!Request.Cookies.TryGetValue("refreshToken", out var refreshToken) || string.IsNullOrEmpty(refreshToken))
        {
            return BadRequest(new { Message = "Refresh token không tồn tại." });
        }

        // Gửi Command sang MediatR
        var command = new RefreshTokenCommand(request.ExpiredAccessToken, refreshToken);
        var response = await Mediator.Send(command);

        //  Cấu hình cookie lưu RefreshToken 
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTime.UtcNow.AddDays(7)
        };
        Response.Cookies.Append("refreshToken", response.RefreshToken, cookieOptions);

        // Trả AccessToken mới cho client 
        return Ok(new
        {
            AccessToken = response.AccessToken,
            Username = response.Username
        });
    }
}
