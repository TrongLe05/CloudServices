using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Exceptions.BadRequestException;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using FluentValidation;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace CloudServices.Application.Features.Users.Commands.ChangeMyPassword;

public sealed record ChangeMyPasswordCommand(
    Guid UserId,
    string CurrentPassword,
    string NewPassword
) : IRequest<Unit>;

public class ChangeMyPasswordCommandValidator : AbstractValidator<ChangeMyPasswordCommand>
{
    public ChangeMyPasswordCommandValidator()
    {
        RuleFor(v => v.UserId)
            .NotEmpty().WithMessage("ID người dùng không được để trống.");

        RuleFor(v => v.CurrentPassword)
            .NotEmpty().WithMessage("Mật khẩu hiện tại không được để trống.");

        RuleFor(v => v.NewPassword)
            .NotEmpty().WithMessage("Mật khẩu mới không được để trống.")
            .MinimumLength(6).WithMessage("Mật khẩu mới phải từ 6 ký tự trở lên.");
    }
}

public sealed class ChangeMyPasswordCommandHandler : IRequestHandler<ChangeMyPasswordCommand, Unit>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IUnitOfWork _unitOfWork;

    public ChangeMyPasswordCommandHandler(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _unitOfWork = unitOfWork;
    }

    public async Task<Unit> Handle(ChangeMyPasswordCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
        if (user == null)
        {
            throw new NotFoundException("Người dùng", request.UserId);
        }

        var isCurrentPasswordValid = _passwordHasher.VerifyPassword(request.CurrentPassword, user.PasswordHash);
        if (!isCurrentPasswordValid)
        {
            throw new BadRequestException("Mật khẩu hiện tại không chính xác.");
        }

        user.PasswordHash = _passwordHasher.HashPasswords(request.NewPassword);
        user.LastModifiedAt = DateTime.UtcNow;
        user.RefreshToken = null;
        user.RefreshTokenExpiryTime = null;
        user.PreviousRefreshToken = null;
        user.PreviousRefreshTokenExpiryTime = null;

        _userRepository.Update(user);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
