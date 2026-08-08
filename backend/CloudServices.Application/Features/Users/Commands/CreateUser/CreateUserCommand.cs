using MediatR;

namespace CloudServices.Application.Features.Users.Commands.CreateUserl;

public record CreateUserCommand : IRequest<Guid>
{
    public string Username { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
    public string FullName { get; init; } = string.Empty;   
    public string Email { get; init; } = string.Empty;
}
