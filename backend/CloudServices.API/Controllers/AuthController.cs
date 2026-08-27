using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.Users.Commands.ChangeMyPassword;
using CloudServices.Application.Features.Users.Commands.ChangePassword;
using CloudServices.Application.Features.Users.Commands.Login;
using CloudServices.Application.Features.Users.Commands.Logout;
using CloudServices.Application.Features.Users.Commands.RefreshToken;
using CloudServices.Application.Features.Users.Commands.RegisterUser;
using CloudServices.Application.Features.Users.Commands.UpdateProfile;
using CloudServices.Application.Features.Users.Queries.GetMe;
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
    IEmailTemplateService _emailTemplateService,
    IMemoryCache _memoryCache,
    IUserRepository _userRepository,
    IConfiguration _configuration) : ApiControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterUserCommand command)
    {
        var userId = await Mediator.Send(command);
        return StatusCode(StatusCodes.Status201Created, new { userId, success = true, message = "Đăng ký tài khoản thành công." });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginCommand command)
    {
        var response = await Mediator.Send(command);

        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTime.UtcNow.AddDays(7)
        };

        Response.Cookies.Append("refreshToken", response.RefreshToken, cookieOptions);
        return Ok(new
        {
            AccessToken = response.AccessToken,
            RefreshToken = response.RefreshToken, // ✅ Thêm RefreshToken vào body
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
        // ✅ Ưu tiên lấy từ Request Body (nếu NextAuth hoặc SPA gửi lên), fallback sang Cookie nếu có
        string? refreshToken = !string.IsNullOrEmpty(request.RefreshToken)
            ? request.RefreshToken
            : Request.Cookies.TryGetValue("refreshToken", out var cookieToken) ? cookieToken : null;

        if (string.IsNullOrEmpty(refreshToken))
        {
            return BadRequest(new { Message = "Refresh token không tồn tại." });
        }

        var command = new RefreshTokenCommand(request.ExpiredAccessToken, refreshToken);
        var response = await Mediator.Send(command);

        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTime.UtcNow.AddDays(7)
        };
        Response.Cookies.Append("refreshToken", response.RefreshToken, cookieOptions);

        return Ok(new
        {
            AccessToken = response.AccessToken,
            RefreshToken = response.RefreshToken, // ✅ Trả refreshToken mới
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
        var emailSubject = "[CloudServices] Mã xác thực OTP đặt lại mật khẩu";
        var emailContent = _emailTemplateService.GenerateOtpEmail(otpCode);

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

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetMe(CancellationToken cancellationToken)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                          ?? User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
        if (string.IsNullOrEmpty(userIdClaim))
        {
            return Unauthorized();
        }
        var userId = Guid.Parse(userIdClaim);
        var query = new GetMeQuery(userId);
        var response = await Mediator.Send(query, cancellationToken);
        return Ok(response);
    }

    public sealed record UpdateProfileRequestDto(string FullName, string? AvatarUrl);

    [HttpPut("me")]
    [Authorize]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequestDto dto, CancellationToken cancellationToken)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                          ?? User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
        if (string.IsNullOrEmpty(userIdClaim))
        {
            return Unauthorized();
        }
        var userId = Guid.Parse(userIdClaim);
        var command = new UpdateProfileCommand(userId, dto.FullName, dto.AvatarUrl);
        await Mediator.Send(command, cancellationToken);
        var response = await Mediator.Send(new GetMeQuery(userId), cancellationToken);
        return Ok(response);
    }

    public sealed record ChangeMyPasswordRequestDto(string CurrentPassword, string NewPassword);

    [HttpPost("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangeMyPassword([FromBody] ChangeMyPasswordRequestDto dto, CancellationToken cancellationToken)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                          ?? User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
        if (string.IsNullOrEmpty(userIdClaim))
        {
            return Unauthorized();
        }
        var userId = Guid.Parse(userIdClaim);
        var command = new ChangeMyPasswordCommand(userId, dto.CurrentPassword, dto.NewPassword);
        await Mediator.Send(command, cancellationToken);
        return Ok(new { success = true, message = "Đổi mật khẩu thành công." });
    }
}
