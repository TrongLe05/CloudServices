using CloudServices.Domain.Entities;

namespace CloudServices.Application.Common.Interfaces.Repositories;

public interface IServiceCategoryRepository
{
    Task<List<ServiceCategory>> GetAllAsync(CancellationToken cancellationToken);
    Task<ServiceCategory?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task AddAsync(ServiceCategory category, CancellationToken cancellationToken);
    Task UpdateAsync(ServiceCategory category, CancellationToken cancellationToken);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken);
}
