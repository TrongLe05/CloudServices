using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Domain.Entities;
using CloudServices.Infrastructure.Data.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CloudServices.Infrastructure.Repositories;

public sealed class RoleRepository(IApplicationDbContext context) : IRoleRepository
{
    public async Task<Role?> GetByNameAsync(string name, CancellationToken cancellationToken)
    {
        return await context.Roles
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.Name == name, cancellationToken);
    }

    public async Task<Role?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await context.Roles
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);
    }

    public async Task<List<Role>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await context.Roles
            .AsNoTracking()
            .OrderBy(r => r.Name)
            .ToListAsync(cancellationToken);
    }
}
