using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Domain.Entities;
using CloudServices.Infrastructure.Data.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CloudServices.Infrastructure.Repositories;

public class RoleRepository : IRoleRepository
{
    private readonly IApplicationDbContext _context;
    public RoleRepository(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Role?> GetByNameAsync(string name, CancellationToken cancellationToken)
    {
        return await _context.Roles.FirstOrDefaultAsync(r => r.Name == name, cancellationToken);
    }
}
