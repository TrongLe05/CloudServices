using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Features.Users.Commands.CreateUserl;
using CloudServices.Application.Features.Users.Queries.GetUsers;
using FluentValidation;
using Mapster;
using MediatR;

namespace CloudServices.Application.Features.Users;

public sealed class CreateUserCommandHandler(IUserRepository users)
    : IRequestHandler<CreateUserCommand, Guid>
{
    public async Task<Guid> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        var defaultRole = await users.GetRoleByNameAsync("User", cancellationToken)
            ?? throw new InvalidOperationException("Default role 'User' not found.");

        var newUser = new Domain.Entities.AppUser
        {
            Id = Guid.NewGuid(),
            Username = request.Username,
            PasswordHash = request.Password,
            FullName = request.FullName,
            Email = request.Email,
            RoleId = defaultRole.Id
        };

        await users.AddAsync(newUser, cancellationToken);
        await users.SaveChangesAsync(cancellationToken);
        return newUser.Id;
    }
}

public sealed class CreateUserCommandValidator : AbstractValidator<CreateUserCommand>
{
    public CreateUserCommandValidator(IUserRepository users)
    {
        RuleFor(command => command.Username)
            .NotEmpty()
            .MaximumLength(50)
            .MustAsync(async (username, cancellationToken) =>
                !await users.UsernameExistsAsync(username, cancellationToken));

        RuleFor(command => command.Email)
            .NotEmpty()
            .EmailAddress()
            .MustAsync(async (email, cancellationToken) =>
                !await users.EmailExistsAsync(email, cancellationToken));

        RuleFor(command => command.Password).NotEmpty().MinimumLength(6);
        RuleFor(command => command.FullName).NotEmpty().MaximumLength(100);
    }
}

public sealed class GetUsersQueryHandler(IUserRepository users)
    : IRequestHandler<GetUsersQuery, List<UserDto>>
{
    public async Task<List<UserDto>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
    {
        var allUsers = await users.GetAllAsync(cancellationToken);
        return allUsers.Adapt<List<UserDto>>();
    }
}
