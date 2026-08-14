using CloudServices.Application.Common.Interfaces;
using CloudServices.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CloudServices.Infrastructure.Repositories;

public class PlanPriceRepository : IPlanPriceRepository
{
    private readonly ApplicationDbContext _context;

    public PlanPriceRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PlanPrice?> GetByServicePlanIdAndBillingCycleAsync(Guid servicePlanId, string billingCycle, CancellationToken cancellationToken)
    {
        return await _context.PlanPrices
            .Include(x => x.Plan)
            .FirstOrDefaultAsync(x => x.PlanId == servicePlanId && x.BillingCycle == billingCycle, cancellationToken);
    }
}
