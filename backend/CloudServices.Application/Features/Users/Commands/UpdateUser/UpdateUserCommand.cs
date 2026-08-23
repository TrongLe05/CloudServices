using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Exceptions.BadRequestException;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using FluentValidation;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace CloudServices.Application.Features.Users.Commands.UpdateUser;

public sealed record UpdateUserCommand(
    Guid Id,
    string FullName,
    string Email,
    Guid RoleId,
    bool IsActive = true,
    string? AvatarUrl = null
) : IRequest<Unit>;

public class UpdateUserCommandValidator : AbstractValidator<UpdateUserCommand>
{
    private readonly IUserRepository _userRepository;

    public UpdateUserCommandValidator(IUserRepository userRepository)
    {
        _userRepository = userRepository;

        RuleFor(v => v.Id)
            .NotEmpty().WithMessage("ID người dùng không được để trống.");

        RuleFor(v => v.FullName)
            .NotEmpty().WithMessage("Họ tên không được để trống.")
            .MaximumLength(100).WithMessage("Họ tên không vượt quá 100 ký tự.");

        RuleFor(v => v.Email)
            .NotEmpty().WithMessage("Email không được để trống.")
            .EmailAddress().WithMessage("Email không đúng định dạng.")
            .MustAsync(BeUniqueEmail).WithMessage("Email đã tồn tại cho tài khoản khác.");

        RuleFor(v => v.RoleId)
            .NotEmpty().WithMessage("Vai trò người dùng không được để trống.");
    }

    private async Task<bool> BeUniqueEmail(UpdateUserCommand command, string email, CancellationToken cancellationToken)
    {
        return !await _userRepository.AnyEmailAsync(email.Trim().ToLowerInvariant(), command.Id, cancellationToken);
    }
}

public sealed class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, Unit>
{
    private readonly IUserRepository _userRepository;
    private readonly IRoleRepository _roleRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateUserCommandHandler(
        IUserRepository userRepository,
        IRoleRepository roleRepository,
        ICurrentUserService currentUserService,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _roleRepository = roleRepository;
        _currentUserService = currentUserService;
        _unitOfWork = unitOfWork;
    }

    public async Task<Unit> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.Id, cancellationToken);
        if (user == null)
        {
            throw new NotFoundException("Người dùng", request.Id);
        }

        var role = await _roleRepository.GetByIdAsync(request.RoleId, cancellationToken);
        if (role == null)
        {
            throw new NotFoundException("Vai trò", request.RoleId);
        }

        var isSelf = _currentUserService.UserId == user.Id;
        var isSystemAdmin = user.Username.Equals("admin", StringComparison.OrdinalIgnoreCase);

        // 1. Không cho phép tự đổi vai trò của chính mình
        if (isSelf && user.RoleId != role.Id)
        {
            throw new BadRequestException("Bạn không thể tự thay đổi vai trò (phân quyền) của chính mình.");
        }

        // 2. Không cho phép tự khóa tài khoản của chính mình
        if (isSelf && !request.IsActive)
        {
            throw new BadRequestException("Bạn không thể tự khóa tài khoản đang đăng nhập của chính bạn.");
        }

        // 3. Không cho phép giáng cấp hoặc khóa tài khoản admin mặc định
        if (isSystemAdmin)
        {
            if (!role.Name.Equals("Admin", StringComparison.OrdinalIgnoreCase))
            {
                throw new BadRequestException("Không thể giáng cấp vai trò của tài khoản Quản trị viên hệ thống mặc định.");
            }

            if (!request.IsActive)
            {
                throw new BadRequestException("Không thể khóa tài khoản Quản trị viên hệ thống mặc định.");
            }
        }

        user.FullName = request.FullName.Trim();
        user.Email = request.Email.Trim().ToLowerInvariant();
        user.RoleId = role.Id;
        user.IsActive = request.IsActive;
        if (request.AvatarUrl != null)
        {
            user.AvatarUrl = request.AvatarUrl.Trim();
        }
        user.LastModifiedAt = DateTime.UtcNow;

        // Nếu chuyển sang khóa tài khoản, thu hồi refresh token
        if (!user.IsActive)
        {
            user.RefreshToken = null;
            user.RefreshTokenExpiryTime = null;
            user.PreviousRefreshToken = null;
            user.PreviousRefreshTokenExpiryTime = null;
        }

        _userRepository.Update(user);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
