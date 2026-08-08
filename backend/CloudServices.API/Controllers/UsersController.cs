using CloudServices.Application.Features.Users.Commands.CreateUserl;
using CloudServices.Application.Features.Users.Queries.GetUsers;
using Microsoft.AspNetCore.Mvc;

namespace CloudServices.API.Controllers;

public class UsersController : ApiControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<UserDto>>> GetUsers(CancellationToken cancellationToken)
    {
        // Gửi Query tới MediatR xử lý
        var result = await Mediator.Send(new GetUsersQuery(), cancellationToken);

        // Trả về kết quả HTTP 200 OK kèm danh sách người dùng
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<Guid>> CreateUser([FromBody] CreateUserCommand command, CancellationToken cancellationToken)
    {
        var userId = await Mediator.Send(command, cancellationToken);
        return Ok(userId);
    }
}
