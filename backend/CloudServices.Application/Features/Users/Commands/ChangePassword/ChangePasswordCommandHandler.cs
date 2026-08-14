using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Common.Exceptions;
using MediatR;
using CloudServices.Application.Common.Exceptions.BadRequestException;

namespace CloudServices.Application.Features.Users.Commands.ChangePassword;

public class ChangePasswordCommandHandler : IRequestHandler<ChangePasswordCommand>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IUnitOfWork _unitOfWork;
    public ChangePasswordCommandHandler(
        IUserRepository userRepository, 
        IPasswordHasher passwordHasher, 
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _unitOfWork = unitOfWork;
    }
    public async Task Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);

        if (user == null) throw new NotFoundException("Người dùng không tồn tại.");

        var isOldPasswordValid = _passwordHasher.VerifyPassword(request.OldPassword, user.PasswordHash);

        if (!isOldPasswordValid) throw new BadRequestException("Mật khẩu cũ không chính xác.");

        user.PasswordHash = _passwordHasher.HashPasswords(request.NewPassword);
         
        user.RefreshToken = null; // Xóa Refresh Token hiện tại khi đổi mật khẩu
        user.RefreshTokenExpiryTime = null; // Xóa thời gian hết hạn của Refresh Token

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}