using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.Users.Commands.CreateUserl;
using MediatR;

namespace CloudServices.Application.Features.Users.Commands.CreateUser;

public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, Guid>
{
    private readonly IUserRepository _userRepository;
    private readonly IRoleRepository _roleRepository;
    private readonly IUnitOfWork _unitOfWork;
    public CreateUserCommandHandler(
        IUserRepository userRepository, 
        IRoleRepository roleRepository, 
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _roleRepository = roleRepository;
        _unitOfWork = unitOfWork;
    }
    public async Task<Guid> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        var defaultRole = await _roleRepository.GetByNameAsync("User", cancellationToken);

        if (defaultRole == null)
        {
            throw new Exception("Default role 'User' not found.");
        }

        var newUser = new Domain.Entities.AppUser
        {
            Id = Guid.NewGuid(), // Gán Guid mới
            Username = request.Username,
            PasswordHash = request.Password, // Trong thực tế cần băm mật khẩu
            FullName = request.FullName,
            Email = request.Email,
            RoleId = defaultRole.Id
        };

        await _userRepository.AddAsync(newUser, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return newUser.Id;
    }
}
