using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Domain.Entities;
using CloudServices.Infrastructure.Data.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CloudServices.Infrastructure.Repositories;

public sealed class UserRepository(IApplicationDbContext context) : IUserRepository
{
    public async Task AddAsync(AppUser user, CancellationToken cancellationToken)
    {
        await context.AppUsers.AddAsync(user, cancellationToken);
    }
    public async Task<bool> AnyAsync(string Username, CancellationToken cancellationToken)
    {
        return await context.AppUsers.AnyAsync(u => u.Username == Username, cancellationToken);
    }
    public async Task<AppUser?> GetByIdAsync(Guid Id, CancellationToken cancellationToken)
    {
        return await context.AppUsers
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Id == Id, cancellationToken);
    }
    public async Task<AppUser?> GetByEmailAsync(string email, CancellationToken cancellationToken)
    {
        return await context.AppUsers
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Email == email, cancellationToken);
    }
    public async Task<AppUser?> GetByUsernameAsync(string username, CancellationToken cancellationToken)
    {
        return await context.AppUsers
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Username == username, cancellationToken);
    }

    public async Task<List<AppUser>> GetWithAllRolesAsync(CancellationToken cancellationToken)
    {
        return await context.AppUsers
            .Include(u => u.Role)
            .ToListAsync(cancellationToken);
    }
}
