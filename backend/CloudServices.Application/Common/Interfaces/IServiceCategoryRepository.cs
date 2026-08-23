using CloudServices.Domain.Entities;

namespace CloudServices.Application.Common.Interfaces;

public interface IServiceCategoryRepository
{
    Task<IReadOnlyList<ServiceCategory>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<ServiceCategory?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<bool> SlugExistsAsync(string slug, Guid? excludingId = null, CancellationToken cancellationToken = default);
    Task AddAsync(ServiceCategory category, CancellationToken cancellationToken = default);
    void Remove(ServiceCategory category);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
