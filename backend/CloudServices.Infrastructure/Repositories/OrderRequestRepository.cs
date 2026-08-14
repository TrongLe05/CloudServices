using CloudServices.Application.Common.Interfaces;
using CloudServices.Domain.Entities;
using CloudServices.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace CloudServices.Infrastructure.Repositories;

public class OrderRequestRepository : IOrderRequestRepository
{
    private readonly ApplicationDbContext _context;

    public OrderRequestRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<OrderRequest?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.OrderRequests
            .Include(x => x.PlanPrice)
            .ThenInclude(x => x.Plan)
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<(IReadOnlyList<OrderRequest> Items, int TotalCount)> GetAsync(
        string? search,
        OrderStatus? status,
        int page,
        int pageSize,
        string? sort,
        CancellationToken cancellationToken = default)
    {
        var query = _context.OrderRequests
            .Include(x => x.PlanPrice)
            .ThenInclude(x => x.Plan)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var text = search.Trim();
            query = query.Where(x => x.CustomerName.Contains(text)
                || x.CustomerEmail.Contains(text)
                || x.CompanyName != null && x.CompanyName.Contains(text));
        }

        if (status.HasValue)
        {
            query = query.Where(x => x.Status == status.Value);
        }

        var totalCount = await query.CountAsync(cancellationToken);

        if (!string.IsNullOrWhiteSpace(sort))
        {
            query = sort.Trim().ToLowerInvariant() switch
            {
                "createdat" => query.OrderByDescending(x => x.CreatedAt),
                "status" => query.OrderBy(x => x.Status),
                _ => query.OrderByDescending(x => x.CreatedAt)
            };
        }
        else
        {
            query = query.OrderByDescending(x => x.CreatedAt);
        }

        var items = await query
            .Skip((Math.Max(1, page) - 1) * Math.Max(1, pageSize))
            .Take(Math.Max(1, pageSize))
            .ToListAsync(cancellationToken);

        return (items, totalCount);
    }

    public async Task AddAsync(OrderRequest orderRequest, CancellationToken cancellationToken = default)
    {
        await _context.OrderRequests.AddAsync(orderRequest, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(OrderRequest orderRequest, CancellationToken cancellationToken = default)
    {
        _context.OrderRequests.Update(orderRequest);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(OrderRequest orderRequest, CancellationToken cancellationToken = default)
    {
        _context.OrderRequests.Remove(orderRequest);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
