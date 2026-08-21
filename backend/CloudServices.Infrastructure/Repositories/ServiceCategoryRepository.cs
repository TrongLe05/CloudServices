using CloudServices.Application.Common.Interfaces;
using CloudServices.Domain.Entities;
using CloudServices.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CloudServices.Infrastructure.Repositories;

public sealed class ServiceCategoryRepository(ApplicationDbContext context) : IServiceCategoryRepository
{
    public async Task<IReadOnlyList<ServiceCategory>> GetAllAsync(CancellationToken cancellationToken = default) =>
        await context.ServiceCategories
            .AsNoTracking()
            .OrderBy(category => category.Name)
            .ToListAsync(cancellationToken);

    public Task<ServiceCategory?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        context.ServiceCategories.FirstOrDefaultAsync(category => category.Id == id, cancellationToken);

    public Task<bool> SlugExistsAsync(string slug, Guid? excludingId = null, CancellationToken cancellationToken = default) =>
        context.ServiceCategories.AnyAsync(
            category => category.Slug == slug &&
                (!excludingId.HasValue || category.Id != excludingId.Value),
            cancellationToken);

    public Task AddAsync(ServiceCategory category, CancellationToken cancellationToken = default) =>
        context.ServiceCategories.AddAsync(category, cancellationToken).AsTask();

    public void Remove(ServiceCategory category) => context.ServiceCategories.Remove(category);

    public Task SaveChangesAsync(CancellationToken cancellationToken = default) =>
        context.SaveChangesAsync(cancellationToken);
}
