using MediatR;
using System;

namespace CloudServices.Application.Features.Users.Commands.CreateUser;

public sealed record CreateUserCommand(
    string Username,
    string Password,
    string FullName,
    string Email,
    Guid? RoleId = null,
    string? AvatarUrl = null
) : IRequest<Guid>;
