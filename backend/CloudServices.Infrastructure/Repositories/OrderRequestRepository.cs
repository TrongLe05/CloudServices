using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Domain.Entities;
using CloudServices.Domain.Enums;
using CloudServices.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace CloudServices.Infrastructure.Repositories;

public sealed class OrderRequestRepository(ApplicationDbContext context) : IOrderRequestRepository
{
    public Task<OrderRequest?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        context.OrderRequests
            .Include(x => x.PlanPrice)
                .ThenInclude(x => x.Plan)
            .Include(x => x.PlanPrice)
                .ThenInclude(x => x.Promotion)
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

    public Task<OrderRequest?> GetByPayOsOrderCodeAsync(long orderCode, CancellationToken cancellationToken = default)
    {
        var tag = $"PayOS:{orderCode}";
        return context.OrderRequests
            .FirstOrDefaultAsync(x => x.Notes != null && x.Notes.Contains(tag), cancellationToken);
    }

    public async Task<(IReadOnlyList<OrderRequest> Items, int TotalCount)> GetPagedAsync(
        string? search,
        OrderStatus? status,
        string? sort,
        int page,
        int pageSize,
        string? customerEmail = null,
        CancellationToken cancellationToken = default)
    {
        var query = context.OrderRequests
            .AsNoTracking()
            .Include(x => x.PlanPrice)
                .ThenInclude(x => x.Plan)
                    .ThenInclude(x => x.Category)
            .Include(x => x.PlanPrice)
                .ThenInclude(x => x.Promotion)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(customerEmail))
        {
            var emailTerm = customerEmail.Trim().ToLower();
            query = query.Where(x => x.CustomerEmail.ToLower() == emailTerm);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(x =>
                x.CustomerName.ToLower().Contains(term) ||
                x.CustomerEmail.ToLower().Contains(term) ||
                (x.CompanyName != null && x.CompanyName.ToLower().Contains(term)));
        }

        if (status.HasValue)
        {
            query = query.Where(x => x.Status == status.Value);
        }

        query = string.Equals(sort, "status", StringComparison.OrdinalIgnoreCase)
            ? query.OrderBy(x => x.Status)
            : query.OrderByDescending(x => x.CreatedAt);

        var total = await query.CountAsync(cancellationToken);
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(cancellationToken);

        return (items, total);
    }

    public Task AddAsync(OrderRequest orderRequest, CancellationToken cancellationToken = default) =>
        context.OrderRequests.AddAsync(orderRequest, cancellationToken).AsTask();

    public void Update(OrderRequest orderRequest)
    {
        var entry = context.Entry(orderRequest);
        if (entry.State == EntityState.Detached)
        {
            context.OrderRequests.Update(orderRequest);
        }
    }

    public void Delete(OrderRequest orderRequest) => context.OrderRequests.Remove(orderRequest);

    public async Task<IReadOnlyList<OrderRequest>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await context.OrderRequests
            .AsNoTracking()
            .Include(x => x.PlanPrice)
                .ThenInclude(x => x.Plan)
                    .ThenInclude(x => x.Category)
            .Include(x => x.PlanPrice)
                .ThenInclude(x => x.Promotion)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync(cancellationToken);
    }
}
