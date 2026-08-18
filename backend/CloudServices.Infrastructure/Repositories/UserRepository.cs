using CloudServices.Application.Common.Interfaces;
using CloudServices.Domain.Entities;
using CloudServices.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CloudServices.Infrastructure.Repositories;

public sealed class UserRepository(ApplicationDbContext context) : IUserRepository
{
    public Task<bool> UsernameExistsAsync(string username, CancellationToken cancellationToken = default) =>
        context.AppUsers.AnyAsync(user => user.Username == username, cancellationToken);

    public Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken = default) =>
        context.AppUsers.AnyAsync(user => user.Email == email, cancellationToken);

    public Task<Role?> GetRoleByNameAsync(string roleName, CancellationToken cancellationToken = default) =>
        context.Roles.FirstOrDefaultAsync(role => role.Name == roleName, cancellationToken);

    public Task AddAsync(AppUser user, CancellationToken cancellationToken = default) =>
        context.AppUsers.AddAsync(user, cancellationToken).AsTask();

    public async Task<IReadOnlyList<AppUser>> GetAllAsync(CancellationToken cancellationToken = default) =>
        await context.AppUsers.Include(user => user.Role).ToListAsync(cancellationToken);

    public Task SaveChangesAsync(CancellationToken cancellationToken = default) =>
        context.SaveChangesAsync(cancellationToken);
}
