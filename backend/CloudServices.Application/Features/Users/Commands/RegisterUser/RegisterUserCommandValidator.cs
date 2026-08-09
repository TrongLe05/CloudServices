using CloudServices.Application.Common.Interfaces.Repositories;
using FluentValidation;

namespace CloudServices.Application.Features.Users.Commands.RegisterUser;

public class RegisterUserCommandValidator : AbstractValidator<RegisterUserCommand>
{
    private readonly IUserRepository _userRepository;
    public RegisterUserCommandValidator(IUserRepository userRepository)
    {
        _userRepository = userRepository;

        RuleFor(u => u.Username)
            .NotEmpty().WithMessage("Tên tài khoản không được để trống!")
            .MaximumLength(50).WithMessage("Tên tài khoản không được vượt quá 50 ký tự!")
            .MustAsync(async (username, cancellationToken) =>
            {
                var user = await _userRepository.GetByUsernameAsync(username, cancellationToken);
                return user == null; // Trả về true nếu chưa có user nào dùng username này
            }).WithMessage("Tên tài khoản đã tồn tại.");

        RuleFor(u => u.Email)
            .NotEmpty().WithMessage("Email không được để trống!")
            .EmailAddress().WithMessage("Email không hợp lệ!")
            .MustAsync(async (email, cancellationToken) =>
            {
                var user = await _userRepository.GetByEmailAsync(email, cancellationToken);
                return user == null; // Trả về true nếu chưa có user nào dùng email này
            }).WithMessage("Email đã được sử dụng.");

        RuleFor(u => u.Password)
            .NotEmpty().WithMessage("Mật khẩu không được để trống!")
            .MinimumLength(6).WithMessage("Mật khẩu phải có ít nhất 6 ký tự!");

        RuleFor(u => u.FullName)
            .NotEmpty().WithMessage("Họ và tên không được để trống!");
    }
}
