using MediatR;

namespace CloudServices.Application.Features.Users.Commands.Login;

public record LoginCommand : IRequest<LoginResponse>
{
    public string Username { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
}
