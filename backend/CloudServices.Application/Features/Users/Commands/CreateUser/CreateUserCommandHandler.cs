using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Features.Users.Commands.CreateUserl;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CloudServices.Application.Features.Users.Commands.CreateUser;

public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, Guid>
{
    private readonly IApplicationDbContext _context;
    public CreateUserCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }
    public async Task<Guid> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        var defaultRole = await _context.Roles.FirstOrDefaultAsync(r => r.Name == "User", cancellationToken);

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

        _context.AppUsers.Add(newUser);
        await _context.SaveChangesAsync(cancellationToken);

        return newUser.Id;
    }
}
