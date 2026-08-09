using CloudServices.Application.Features.Users.Commands.Login;
using CloudServices.Application.Features.Users.Commands.Logout;
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
        return Ok(response);
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
}
