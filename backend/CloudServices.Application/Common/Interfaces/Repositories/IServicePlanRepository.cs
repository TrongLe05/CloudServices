using CloudServices.Domain.Entities;

namespace CloudServices.Application.Common.Interfaces.Repositories;

public interface IServicePlanRepository
{
    Task<ServicePlan?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
}