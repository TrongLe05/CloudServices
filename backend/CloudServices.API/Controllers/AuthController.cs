using Azure.Core;
using CloudServices.Application.Common.Interfaces;
﻿using Azure.Core;
using CloudServices.Application.Features.Users.Commands.ChangePassword;
using CloudServices.Application.Features.Users.Commands.Login;
using CloudServices.Application.Features.Users.Commands.Logout;
using CloudServices.Application.Features.Users.Commands.RefreshToken;
using CloudServices.Application.Features.Users.Commands.RegisterUser;
using CloudServices.Application.Common.Interfaces.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CloudServices.API.Controllers;

public sealed class AuthController(
    IEmailSender _emailSender,
    IMemoryCache _memoryCache,
    IUserRepository _userRepository,
    IConfiguration _configuration) : ApiControllerBase
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

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(dto.Email))
        {
            return BadRequest(new { message = "Email không được để trống." });
        }

        // 1. Kiểm tra Email có tồn tại trong hệ thống hay không
        var user = await _userRepository.GetByEmailAsync(dto.Email, cancellationToken);
        if (user == null)
        {
            return BadRequest(new { message = "Email không tồn tại trong hệ thống." });
        }

        // 2. Sinh mã OTP ngẫu nhiên gồm 6 chữ số
        var otpCode = new Random().Next(100000, 999999).ToString();

        // 3. Lưu OTP vào Cache đệm 5 phút
        var cacheKey = $"OTP_{dto.Email}";
        var cacheOptions = new MemoryCacheEntryOptions()
            .SetAbsoluteExpiration(TimeSpan.FromMinutes(5));
        _memoryCache.Set(cacheKey, otpCode, cacheOptions);

        // 4. Gửi email thông qua Interface _emailSender
        var emailSubject = "Mã xác thực OTP đặt lại mật khẩu";
        var emailContent = $@"
                <!DOCTYPE html>
                <html lang=""vi"">
                <head>
                    <meta charset=""UTF-8"">
                    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
                    <title>Mã xác thực OTP đặt lại mật khẩu</title>
                </head>
                <body style=""margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f1f5f9; color: #333333;"">
                    <table width=""100%"" cellpadding=""0"" cellspacing=""0"" border=""0"" style=""background-color: #f1f5f9; padding: 40px 20px;"">
                        <tr>
                            <td align=""center"">
                                <!-- Main Card -->
                                <table width=""100%"" cellpadding=""0"" cellspacing=""0"" border=""0"" style=""max-width: 500px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow: hidden;"">
                    
                                    <!-- Header -->
                                    <tr>
                                        <td style=""background-color: #2563eb; padding: 24px; text-align: center;"">
                                            <h2 style=""color: #ffffff; margin: 0; font-size: 22px; font-weight: 600;"">Xác Thực Tài Khoản</h2>
                                        </td>
                                    </tr>
                    
                                    <!-- Body Content -->
                                    <tr>
                                        <td style=""padding: 32px 24px;"">
                                            <p style=""margin: 0 0 16px 0; font-size: 16px; color: #334155;"">Chào bạn,</p>
                                            <p style=""margin: 0 0 24px 0; font-size: 16px; color: #475569; line-height: 1.6;"">
                                                Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng sử dụng mã xác thực (OTP) dưới đây để tiếp tục quá trình:
                                            </p>
                            
                                            <!-- OTP Box -->
                                            <div style=""text-align: center; margin: 32px 0;"">
                                                <span style=""display: inline-block; padding: 16px 32px; background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #1d4ed8; font-family: 'Courier New', Courier, monospace;"">
                                                    {otpCode}
                                                </span>
                                            </div>
                            
                                            <p style=""margin: 0 0 16px 0; font-size: 14px; color: #64748b; line-height: 1.5;"">
                                                Mã này có hiệu lực trong vòng <strong>5 phút</strong>. Tuyệt đối không chia sẻ mã này cho bất kỳ ai để đảm bảo an toàn cho tài khoản.
                                            </p>
                                            <p style=""margin: 0; font-size: 14px; color: #64748b; line-height: 1.5;"">
                                                Nếu bạn không yêu cầu đặt lại mật khẩu, xin vui lòng bỏ qua email này.
                                            </p>
                                        </td>
                                    </tr>
                    
                                    <!-- Footer -->
                                    <tr>
                                        <td style=""background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;"">
                                            <p style=""margin: 0; font-size: 12px; color: #94a3b8;"">
                                                &copy; 2026 Cloud Services. Mọi quyền được bảo lưu.
                                            </p>
                                        </td>
                                    </tr>
                    
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>";

        try
        {
            await _emailSender.SendEmailAsync(dto.Email, emailSubject, emailContent);
            return Ok(new { success = true, message = "Mã xác thực OTP đã được gửi về email của bạn." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Lỗi hệ thống khi gửi email. Vui lòng thử lại sau.", detail = ex.Message });
        }
    }

    [HttpPost("verify-otp")]
    public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpDto dto, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(dto.Email) || string.IsNullOrEmpty(dto.Otp))
        {
            return BadRequest(new { message = "Email và mã OTP không được để trống." });
        }

        var cacheKey = $"OTP_{dto.Email}";

        // 1. Kiểm tra OTP trong Cache
        if (!_memoryCache.TryGetValue(cacheKey, out string? cachedOtp))
        {
            return BadRequest(new { message = "Mã OTP đã hết hạn hoặc không tồn tại. Vui lòng gửi lại yêu cầu." });
        }

        // 2. So khớp OTP
        if (cachedOtp != dto.Otp)
        {
            return BadRequest(new { message = "Mã xác thực OTP không chính xác." });
        }

        // 3. Tìm User để lấy PasswordHash nhằm sinh token bảo mật động
        var user = await _userRepository.GetByEmailAsync(dto.Email, cancellationToken);
        if (user == null)
        {
            return BadRequest(new { message = "Người dùng không tồn tại." });
        }

        // 4. Sinh ResetToken ngắn hạn (5 phút) sử dụng Secret + user.PasswordHash làm chữ ký động
        var jwtSecret = _configuration["JwtSettings:Secret"] ?? throw new InvalidOperationException("Chưa cấu hình JWT Secret");
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret + user.PasswordHash));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.Email, user.Email ?? string.Empty),
            new Claim("purpose", "reset-password")
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["JwtSettings:Issuer"],
            audience: _configuration["JwtSettings:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(5),
            signingCredentials: credentials);

        var resetToken = new JwtSecurityTokenHandler().WriteToken(token);

        // 5. Đã xác thực thành công -> Xóa OTP khỏi cache ngay lập tức để tránh dùng lại
        _memoryCache.Remove(cacheKey);

        return Ok(new { success = true, resetToken = resetToken });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(dto.ResetToken) || string.IsNullOrEmpty(dto.NewPassword))
        {
            return BadRequest(new { message = "Reset token và mật khẩu mới không được để trống." });
        }

        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            // 1. Đọc email từ Token trước khi xác thực signature (để tìm User và PasswordHash tương ứng)
            var jwtToken = tokenHandler.ReadJwtToken(dto.ResetToken);
            var email = jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(email))
            {
                return BadRequest(new { message = "Mã xác thực không hợp lệ." });
            }

            // 2. Tìm User trong Database
            var user = await _userRepository.GetByEmailAsync(email, cancellationToken);
            if (user == null)
            {
                return BadRequest(new { message = "Người dùng không tồn tại." });
            }

            // 3. Tiến hành xác thực chữ ký của Token bằng Khóa bí mật động (Secret + PasswordHash)
            var jwtSecret = _configuration["JwtSettings:Secret"] ?? throw new InvalidOperationException("Chưa cấu hình JWT Secret");
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret + user.PasswordHash)),
                ValidateIssuer = true,
                ValidIssuer = _configuration["JwtSettings:Issuer"],
                ValidateAudience = true,
                ValidAudience = _configuration["JwtSettings:Audience"],
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };

            // Nếu signature hoặc thời gian hết hạn không hợp lệ, hàm này sẽ ném ra ngoại lệ
            tokenHandler.ValidateToken(dto.ResetToken, validationParameters, out SecurityToken validatedToken);

            // 4. Xác thực thành công -> Tiến hành đổi mật khẩu bằng cách gửi ChangePasswordCommand sang Mediator
            var command = new ChangePasswordCommand(email, dto.NewPassword);
            await Mediator.Send(command, cancellationToken);

            return Ok(new { success = true, message = "Đặt lại mật khẩu thành công!" });
        }
        catch (SecurityTokenExpiredException)
        {
            return BadRequest(new { message = "Liên kết xác thực đã hết hạn. Vui lòng thực hiện lại từ đầu." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Yêu cầu đặt lại mật khẩu không hợp lệ.", detail = ex.Message });
        }
    }
}
