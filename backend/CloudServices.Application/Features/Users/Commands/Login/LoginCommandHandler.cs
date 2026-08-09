using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using MediatR;

namespace CloudServices.Application.Features.Users.Commands.Login;

public class LoginCommandHandler : IRequestHandler<LoginCommand, LoginResponse>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IUnitOfWork _unitOfWork;

    public LoginCommandHandler(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        IJwtTokenGenerator jwtTokenGenerator,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _jwtTokenGenerator = jwtTokenGenerator;
        _unitOfWork = unitOfWork;
    }
    public async Task<LoginResponse> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        // 1. Kiểm tra tài khoản tồn tại hay không
        var user = await _userRepository.GetByUsernameAsync(request.Username, cancellationToken);
        if (user == null)
        {
            throw new UnauthorizedException("Tài khoản hoặc mật khẩu không chính xác.");
        }

        // 2. Xác thực mật khẩu thông qua IPasswordHasher đã tạo ở bước trước
        var isPasswordValid = _passwordHasher.VerifyPassword(request.Password, user.PasswordHash);
        if (!isPasswordValid)
        {
            throw new UnauthorizedException("Tài khoản hoặc mật khẩu không chính xác.");
        }

        // 3. Phát sinh Access Token và Refresh Token mới
        var accessToken = _jwtTokenGenerator.GenerateToken(user);
        var refreshToken = _jwtTokenGenerator.GenerateRefreshToken();

        // 4. Lưu lại Refresh Token vào cơ sở dữ liệu
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7); // Hết hạn sau 7 ngày

        // Lưu thay đổi qua UnitOfWork
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new LoginResponse(accessToken, refreshToken);
    }
}
