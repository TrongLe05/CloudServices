using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Exceptions.BadRequestException;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace CloudServices.Application.Features.Users.Commands.ToggleUserStatus;

public sealed record ToggleUserStatusCommand(Guid Id, bool? IsActive = null) : IRequest<bool>;

public sealed class ToggleUserStatusCommandHandler : IRequestHandler<ToggleUserStatusCommand, bool>
{
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IUnitOfWork _unitOfWork;

    public ToggleUserStatusCommandHandler(
        IUserRepository userRepository,
        ICurrentUserService currentUserService,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _currentUserService = currentUserService;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(ToggleUserStatusCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.Id, cancellationToken);
        if (user == null)
        {
            throw new NotFoundException("Người dùng", request.Id);
        }

        // Không cho phép tự khóa tài khoản của chính mình
        if (_currentUserService.UserId == user.Id)
        {
            throw new BadRequestException("Không thể tự khóa tài khoản đang đăng nhập của chính bạn.");
        }

        // Không cho phép khóa tài khoản quản trị viên mặc định
        if (user.Username.Equals("admin", StringComparison.OrdinalIgnoreCase))
        {
            throw new BadRequestException("Không thể khóa tài khoản Quản trị viên hệ thống mặc định.");
        }

        // Đảo trạng thái hoặc gán giá trị chỉ định
        user.IsActive = request.IsActive ?? !user.IsActive;
        user.LastModifiedAt = DateTime.UtcNow;

        // Nếu khóa tài khoản, thu hồi toàn bộ refresh token để buộc đăng xuất
        if (!user.IsActive)
        {
            user.RefreshToken = null;
            user.RefreshTokenExpiryTime = null;
            user.PreviousRefreshToken = null;
            user.PreviousRefreshTokenExpiryTime = null;
        }

        _userRepository.Update(user);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return user.IsActive;
    }
}
