using MediatR;

namespace CloudServices.Application.Features.Users.Commands.ChangePassword;

public record ChangePasswordCommand(string Email,string NewPassword) : IRequest; 
