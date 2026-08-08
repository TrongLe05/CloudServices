using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Features.Users.Commands.CreateUserl;
using FluentValidation;
using Microsoft.EntityFrameworkCore;


namespace CloudServices.Application.Features.Users.Commands.CreateUser;

public class CreateUserCommandValidator : AbstractValidator<CreateUserCommand>
{
    private readonly IApplicationDbContext _context;
    public CreateUserCommandValidator(IApplicationDbContext context)
    {
        _context = context;

        RuleFor(v => v.Username)
                .NotEmpty().WithMessage("Username không được để trống.")
                .MaximumLength(50).WithMessage("Username không vượt quá 50 ký tự.")
                .MustAsync(BeUniqueUsername).WithMessage("Username đã tồn tại trên hệ thống.");

        RuleFor(v => v.Email)
            .NotEmpty().WithMessage("Email không được để trống.")
            .EmailAddress().WithMessage("Email không đúng định dạng.")
            .MustAsync(BeUniqueEmail).WithMessage("Email đã tồn tại trên hệ thống.");

        RuleFor(v => v.Password)
            .NotEmpty().WithMessage("Mật khẩu không được để trống.")
            .MinimumLength(6).WithMessage("Mật khẩu phải từ 6 ký tự trở lên.");

        RuleFor(v => v.FullName)
            .NotEmpty().WithMessage("Họ tên không được để trống.")
            .MaximumLength(100).WithMessage("Họ tên không vượt quá 100 ký tự.");
    }
    private async Task<bool> BeUniqueUsername(string username, CancellationToken cancellationToken)
    {
        return !await _context.AppUsers.AnyAsync(x => x.Username == username, cancellationToken);
    }

    private async Task<bool> BeUniqueEmail(string email, CancellationToken cancellationToken)
    {
        return !await _context.AppUsers.AnyAsync(x => x.Email == email, cancellationToken);
    }

}
