using MediatR;
namespace CloudServices.Application.Features.Users.Commands.Logout;
public record LogoutCommand(Guid UserId) : IRequest;
