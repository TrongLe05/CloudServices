using CloudServices.Application.Common.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;
using CloudServices.Domain.Entities;
using CloudServices.Infrastructure.Data;

namespace CloudServices.Infrastructure.Repositories;

public class ServicePlanRepository : IServicePlanRepository
{
    private readonly ApplicationDbContext _context;

    public ServicePlanRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ServicePlan?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.ServicePlans
            .AsNoTracking()
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
    }

    public async Task<(IReadOnlyList<ServicePlan> Items, int TotalCount)> GetPagedAsync(
        Guid? categoryId, string? search, string? sort, int page, int pageSize,
        CancellationToken cancellationToken = default)
    {
        var query = _context.ServicePlans
            .AsNoTracking()
            .Include(p => p.Category)
            .AsQueryable();
        if (categoryId.HasValue) query = query.Where(p => p.CategoryId == categoryId.Value);
        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();
            query = query.Where(p => p.Name.Contains(term) || (p.Description != null && p.Description.Contains(term)));
        }

        query = string.Equals(sort, "price", StringComparison.OrdinalIgnoreCase)
            ? query.OrderBy(p => p.PlanPrices.OrderBy(price => price.Price).Select(price => (decimal?)price.Price).FirstOrDefault())
            : query.OrderByDescending(p => p.CreatedAt);

        var total = await query.CountAsync(cancellationToken);
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(cancellationToken);
        return (items, total);
    }

    public Task AddAsync(ServicePlan servicePlan, CancellationToken cancellationToken = default) =>
        _context.ServicePlans.AddAsync(servicePlan, cancellationToken).AsTask();

    public void Update(ServicePlan servicePlan) => _context.ServicePlans.Update(servicePlan);

    public void Delete(ServicePlan servicePlan) => _context.ServicePlans.Remove(servicePlan);
}
