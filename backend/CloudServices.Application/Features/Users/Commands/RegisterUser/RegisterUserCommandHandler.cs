using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Domain.Entities;
using MediatR;

namespace CloudServices.Application.Features.Users.Commands.RegisterUser;

public class RegisterUserCommandHandler : IRequestHandler<RegisterUserCommand, Guid>
{
    private readonly IUserRepository _userRepository;
    private readonly IRoleRepository _roleRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPasswordHasher _passwordHasher;

    public RegisterUserCommandHandler(
        IUserRepository userRepository,
        IRoleRepository roleRepository,
        IUnitOfWork unitOfWork,
        IPasswordHasher passwordHasher)
    {
        _userRepository = userRepository;
        _roleRepository = roleRepository;
        _unitOfWork = unitOfWork;
        _passwordHasher = passwordHasher;
    }

    public async Task<Guid> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
    {
        // Lấy thông tin Role mặc định cho User mới đăng ký
        var userRole = await _roleRepository.GetByNameAsync("User", cancellationToken);
        if (userRole == null)
        {
            throw new Exception("Hệ thống chưa cấu hình vai trò mặc định.");
        }

        // Tạo Entity AppUser
        var newUser = new AppUser
        {
            Id = Guid.NewGuid(),
            Username = request.Username,
            // Trong thực tế bạn cần hash password (ví dụ BCrypt), ở đây tạm thời để test
            PasswordHash = _passwordHasher.HashPasswords(request.Password),
            FullName = request.FullName,
            Email = request.Email,
            RoleId = userRole.Id
        };

        // Lưu thông qua Repository
        await _userRepository.AddAsync(newUser, cancellationToken);

        // Commit dữ liệu xuống database thông qua Unit of Work
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // Trả về Guid của người dùng mới tạo
        return newUser.Id;
    }
}