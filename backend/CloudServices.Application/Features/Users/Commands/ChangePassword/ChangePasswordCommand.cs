using MediatR;

namespace CloudServices.Application.Features.Users.Commands.ChangePassword;

public record ChangePasswordCommand(Guid UserId, string OldPassword, string NewPassword) : IRequest; 
