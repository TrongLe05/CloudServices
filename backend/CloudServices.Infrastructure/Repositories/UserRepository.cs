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

    public void Update(AppUser user)
    {
        context.AppUsers.Update(user);
    }

    public void Delete(AppUser user)
    {
        context.AppUsers.Remove(user);
    }

    public async Task<bool> AnyAsync(string username, CancellationToken cancellationToken)
    {
        return await context.AppUsers
            .IgnoreQueryFilters()
            .AnyAsync(u => u.Username == username, cancellationToken);
    }

    public async Task<bool> AnyEmailAsync(string email, Guid? excludeUserId, CancellationToken cancellationToken)
    {
        return await context.AppUsers
            .IgnoreQueryFilters()
            .AnyAsync(u => u.Email == email && (!excludeUserId.HasValue || u.Id != excludeUserId.Value), cancellationToken);
    }

    public async Task<bool> AnyUsernameAsync(string username, Guid? excludeUserId, CancellationToken cancellationToken)
    {
        return await context.AppUsers
            .IgnoreQueryFilters()
            .AnyAsync(u => u.Username == username && (!excludeUserId.HasValue || u.Id != excludeUserId.Value), cancellationToken);
    }

    public async Task<AppUser?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await context.AppUsers
            .IgnoreQueryFilters()
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
    }

    public async Task<AppUser?> GetByEmailAsync(string email, CancellationToken cancellationToken)
    {
        return await context.AppUsers
            .IgnoreQueryFilters()
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Email == email, cancellationToken);
    }

    public async Task<AppUser?> GetByUsernameAsync(string username, CancellationToken cancellationToken)
    {
        return await context.AppUsers
            .IgnoreQueryFilters()
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Username == username, cancellationToken);
    }

    public async Task<List<AppUser>> GetWithAllRolesAsync(CancellationToken cancellationToken)
    {
        return await context.AppUsers
            .IgnoreQueryFilters()
            .Include(u => u.Role)
            .ToListAsync(cancellationToken);
    }

    public async Task<(List<AppUser> Items, int TotalItems)> GetPagedUsersAsync(
        string? search,
        Guid? roleId,
        int page,
        int pageSize,
        CancellationToken cancellationToken)
    {
        var query = context.AppUsers
            .IgnoreQueryFilters()
            .Include(u => u.Role)
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            query = query.Where(u => u.Username.ToLower().Contains(s)
                                  || u.FullName.ToLower().Contains(s)
                                  || u.Email.ToLower().Contains(s));
        }

        if (roleId.HasValue && roleId.Value != Guid.Empty)
        {
            query = query.Where(u => u.RoleId == roleId.Value);
        }

        var totalItems = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderByDescending(u => u.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (items, totalItems);
    }
}
