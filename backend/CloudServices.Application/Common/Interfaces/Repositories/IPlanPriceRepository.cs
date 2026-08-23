using CloudServices.Domain.Entities;

namespace CloudServices.Application.Common.Interfaces.Repositories;

public interface IPlanPriceRepository
{
    Task<List<PlanPrice>> GetByPlanIdAsync(Guid planId, CancellationToken cancellationToken = default);
    Task<PlanPrice?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task AddAsync(PlanPrice planPrice, CancellationToken cancellationToken = default);
    void Update(PlanPrice planPrice);
    void Delete(PlanPrice planPrice);
}