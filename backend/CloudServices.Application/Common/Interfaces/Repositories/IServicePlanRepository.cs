using CloudServices.Domain.Entities;

namespace CloudServices.Application.Common.Interfaces.Repositories;

public interface IServicePlanRepository
{
    Task<ServicePlan?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<(IReadOnlyList<ServicePlan> Items, int TotalCount)> GetPagedAsync(
        Guid? categoryId, string? search, string? sort, int page, int pageSize,
        CancellationToken cancellationToken = default);
    Task AddAsync(ServicePlan servicePlan, CancellationToken cancellationToken = default);
    void Update(ServicePlan servicePlan);
    void Delete(ServicePlan servicePlan);
}
