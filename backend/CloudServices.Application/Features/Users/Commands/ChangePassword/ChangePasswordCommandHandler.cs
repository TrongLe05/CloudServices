using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Common.Exceptions;
using MediatR;
using CloudServices.Application.Common.Exceptions.BadRequestException;

namespace CloudServices.Application.Features.Users.Commands.ChangePassword;

public sealed class ChangePasswordCommandHandler(
    IUserRepository _userRepository, 
    IPasswordHasher _passwordHasher, 
    IUnitOfWork _unitOfWork) : IRequestHandler<ChangePasswordCommand>
{
    public async Task Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);

        if (user == null) throw new NotFoundException($"Người dùng có email: {request.Email} không tồn tại.");

        user.PasswordHash = _passwordHasher.HashPasswords(request.NewPassword);

        user.RefreshToken = null; // Xóa Refresh Token hiện tại khi đổi mật khẩu
        user.RefreshTokenExpiryTime = null; // Xóa thời gian hết hạn của Refresh Token

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}