using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Domain.Entities;
using CloudServices.Infrastructure.Data.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CloudServices.Infrastructure.Repositories;

public sealed class RoleRepository(IApplicationDbContext context) : IRoleRepository
{

    public async Task<Role?> GetByNameAsync(string name, CancellationToken cancellationToken)
    {
        return await context.Roles.FirstOrDefaultAsync(r => r.Name == name, cancellationToken);
    }
}
