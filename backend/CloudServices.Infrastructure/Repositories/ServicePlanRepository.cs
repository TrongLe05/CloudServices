using Microsoft.EntityFrameworkCore;
using CloudServices.Application.Common.Interfaces.Repositories;
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
        return await _context.ServicePlans.FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
    }
}