using CloudServices.Application.Features.Users.Commands.ChangeUserPassword;
using CloudServices.Application.Features.Users.Commands.CreateUser;
using CloudServices.Application.Features.Users.Commands.DeleteUser;
using CloudServices.Application.Features.Users.Commands.UpdateUser;
using CloudServices.Application.Features.Users.DTOs;
using CloudServices.Application.Features.Users.Queries.GetRoles;
using CloudServices.Application.Features.Users.Queries.GetUserById;
using CloudServices.Application.Features.Users.Queries.GetUsers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace CloudServices.API.Controllers;

[Authorize(Roles = "Admin")]
[Route("api/[controller]")]
public class UsersController : ApiControllerBase
{
    [HttpGet]
    public async Task<ActionResult<UserPageDto>> GetUsers(
        [FromQuery] string? search,
        [FromQuery] Guid? roleId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        CancellationToken cancellationToken = default)
    {
        var query = new GetUsersQuery(search, roleId, page, pageSize);
        var result = await Mediator.Send(query, cancellationToken);
        return Ok(result);
    }

    [HttpGet("roles")]
    public async Task<ActionResult<List<RoleDto>>> GetRoles(CancellationToken cancellationToken)
    {
        var result = await Mediator.Send(new GetRolesQuery(), cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<UserDto>> GetUserById(Guid id, CancellationToken cancellationToken)
    {
        var result = await Mediator.Send(new GetUserByIdQuery(id), cancellationToken);
        return Ok(result);
    }

    public sealed record CreateUserRequestDto(
        string Username,
        string Password,
        string FullName,
        string Email,
        Guid? RoleId,
        string? AvatarUrl
    );

    [HttpPost]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserRequestDto dto, CancellationToken cancellationToken)
    {
        var command = new CreateUserCommand(
            dto.Username,
            dto.Password,
            dto.FullName,
            dto.Email,
            dto.RoleId,
            dto.AvatarUrl
        );

        var userId = await Mediator.Send(command, cancellationToken);
        var createdUser = await Mediator.Send(new GetUserByIdQuery(userId), cancellationToken);
        return CreatedAtAction(nameof(GetUserById), new { id = userId }, createdUser);
    }

    public sealed record UpdateUserRequestDto(
        string FullName,
        string Email,
        Guid RoleId,
        bool IsActive = true,
        string? AvatarUrl = null
    );

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UpdateUserRequestDto dto, CancellationToken cancellationToken)
    {
        var command = new UpdateUserCommand(
            id,
            dto.FullName,
            dto.Email,
            dto.RoleId,
            dto.IsActive,
            dto.AvatarUrl
        );

        await Mediator.Send(command, cancellationToken);
        var updatedUser = await Mediator.Send(new GetUserByIdQuery(id), cancellationToken);
        return Ok(updatedUser);
    }

    public sealed record ResetPasswordRequestDto(string NewPassword);

    [HttpPatch("{id:guid}/password")]
    public async Task<IActionResult> ResetUserPassword(Guid id, [FromBody] ResetPasswordRequestDto dto, CancellationToken cancellationToken)
    {
        var command = new ChangeUserPasswordCommand(id, dto.NewPassword);
        await Mediator.Send(command, cancellationToken);
        return Ok(new { message = "Đã đặt lại mật khẩu thành công." });
    }

    public sealed record ToggleStatusRequestDto(bool? IsActive = null);

    [HttpPatch("{id:guid}/status")]
    public async Task<IActionResult> ToggleUserStatus(Guid id, [FromBody] ToggleStatusRequestDto? dto, CancellationToken cancellationToken)
    {
        var command = new CloudServices.Application.Features.Users.Commands.ToggleUserStatus.ToggleUserStatusCommand(id, dto?.IsActive);
        var newStatus = await Mediator.Send(command, cancellationToken);
        return Ok(new { isActive = newStatus, message = newStatus ? "Đã mở khóa tài khoản thành công." : "Đã khóa tài khoản thành công." });
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteUser(Guid id, CancellationToken cancellationToken)
    {
        await Mediator.Send(new DeleteUserCommand(id), cancellationToken);
        return NoContent();
    }
}
