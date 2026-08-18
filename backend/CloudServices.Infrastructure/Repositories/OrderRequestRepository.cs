using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Domain.Entities;
using CloudServices.Domain.Enums;
using CloudServices.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CloudServices.Infrastructure.Repositories;

public sealed class OrderRequestRepository(ApplicationDbContext context) : IOrderRequestRepository
{
    public Task<OrderRequest?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        context.OrderRequests.Include(x => x.PlanPrice).ThenInclude(x => x.Plan).FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

    public async Task<(IReadOnlyList<OrderRequest> Items, int TotalCount)> GetPagedAsync(string? search, OrderStatus? status, string? sort, int page, int pageSize, CancellationToken cancellationToken = default)
    {
        var query = context.OrderRequests.Include(x => x.PlanPrice).ThenInclude(x => x.Plan).AsQueryable();
        if (!string.IsNullOrWhiteSpace(search)) { var term = search.Trim(); query = query.Where(x => x.CustomerName.Contains(term) || x.CustomerEmail.Contains(term) || (x.CompanyName != null && x.CompanyName.Contains(term))); }
        if (status.HasValue) query = query.Where(x => x.Status == status.Value);
        query = string.Equals(sort, "status", StringComparison.OrdinalIgnoreCase) ? query.OrderBy(x => x.Status) : query.OrderByDescending(x => x.CreatedAt);
        var total = await query.CountAsync(cancellationToken);
        return (await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(cancellationToken), total);
    }
    public Task AddAsync(OrderRequest orderRequest, CancellationToken cancellationToken = default) => context.OrderRequests.AddAsync(orderRequest, cancellationToken).AsTask();
    public void Update(OrderRequest orderRequest) => context.OrderRequests.Update(orderRequest);
    public void Delete(OrderRequest orderRequest) => context.OrderRequests.Remove(orderRequest);
}
