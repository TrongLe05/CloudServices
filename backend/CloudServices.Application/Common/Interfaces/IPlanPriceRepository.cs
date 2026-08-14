using CloudServices.Domain.Entities;

namespace CloudServices.Application.Common.Interfaces;

public interface IPlanPriceRepository
{
    Task<PlanPrice?> GetByServicePlanIdAndBillingCycleAsync(Guid servicePlanId, string billingCycle, CancellationToken cancellationToken);
}
