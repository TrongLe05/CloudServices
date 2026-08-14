using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Domain.Entities;
using CloudServices.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CloudServices.Infrastructure.Repositories;

public class PlanPriceRepository : IPlanPriceRepository
{
    private readonly ApplicationDbContext _context;

    public PlanPriceRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<PlanPrice>> GetByPlanIdAsync(Guid planId, CancellationToken cancellationToken = default)
    {
        return await _context.PlanPrices
            .Where(p => p.PlanId == planId)
            .ToListAsync(cancellationToken);
    }

    public async Task<PlanPrice?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.PlanPrices
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
    }

    public async Task AddAsync(PlanPrice planPrice, CancellationToken cancellationToken = default)
    {
        await _context.PlanPrices.AddAsync(planPrice, cancellationToken);
    }

    public void Update(PlanPrice planPrice)
    {
        _context.PlanPrices.Update(planPrice);
    }

    public void Delete(PlanPrice planPrice)
    {
        _context.PlanPrices.Remove(planPrice);
    }

    public async Task<PlanPrice?> GetByServicePlanIdAndBillingCycleAsync(Guid servicePlanId, string billingCycle, CancellationToken cancellationToken)
    {
        return await _context.PlanPrices
            .Include(x => x.Plan)
            .FirstOrDefaultAsync(x => x.PlanId == servicePlanId && x.BillingCycle == billingCycle, cancellationToken);
    }
}
