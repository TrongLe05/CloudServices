using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Domain.Entities;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace CloudServices.Application.Features.Users.Commands.CreateUser;

public sealed class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, Guid>
{
    private readonly IUserRepository _userRepository;
    private readonly IRoleRepository _roleRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IUnitOfWork _unitOfWork;

    public CreateUserCommandHandler(
        IUserRepository userRepository,
        IRoleRepository roleRepository,
        IPasswordHasher passwordHasher,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _roleRepository = roleRepository;
        _passwordHasher = passwordHasher;
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        Guid roleId;

        if (request.RoleId.HasValue && request.RoleId.Value != Guid.Empty)
        {
            var role = await _roleRepository.GetByIdAsync(request.RoleId.Value, cancellationToken);
            if (role == null)
            {
                throw new NotFoundException("Vai trò", request.RoleId.Value);
            }
            roleId = role.Id;
        }
        else
        {
            var defaultRole = await _roleRepository.GetByNameAsync("User", cancellationToken);
            if (defaultRole == null)
            {
                throw new NotFoundException("Vai trò mặc định 'User' không tồn tại trên hệ thống.");
            }
            roleId = defaultRole.Id;
        }

        var newUser = new AppUser
        {
            Id = Guid.NewGuid(),
            Username = request.Username.Trim(),
            PasswordHash = _passwordHasher.HashPasswords(request.Password),
            FullName = request.FullName.Trim(),
            Email = request.Email.Trim().ToLowerInvariant(),
            AvatarUrl = request.AvatarUrl?.Trim() ?? string.Empty,
            RoleId = roleId
        };

        await _userRepository.AddAsync(newUser, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return newUser.Id;
    }
}
