using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Domain.Entities;
using CloudServices.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CloudServices.Infrastructure.Repositories;

public class ServiceCategoryRepository : IServiceCategoryRepository
{
    private readonly ApplicationDbContext _context;

    public ServiceCategoryRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(ServiceCategory category, CancellationToken cancellationToken)
    {
        await _context.ServiceCategories.AddAsync(category, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var entity = await _context.ServiceCategories.FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
        if (entity == null) return;
        _context.ServiceCategories.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<List<ServiceCategory>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await _context.ServiceCategories.AsNoTracking().ToListAsync(cancellationToken);
    }

    public async Task<ServiceCategory?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _context.ServiceCategories.FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
    }

    public async Task UpdateAsync(ServiceCategory category, CancellationToken cancellationToken)
    {
        _context.ServiceCategories.Update(category);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
