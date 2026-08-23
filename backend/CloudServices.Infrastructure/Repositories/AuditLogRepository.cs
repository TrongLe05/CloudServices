using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Domain.Entities;
using CloudServices.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CloudServices.Infrastructure.Repositories;

public sealed class AuditLogRepository(ApplicationDbContext context) : IAuditLogRepository
{
    public Task<AuditLog?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        context.AuditLogs
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

    public async Task<(IReadOnlyList<AuditLog> Items, int TotalCount)> GetPagedAsync(
        string? category,
        string? search,
        string? action,
        string? httpMethod,
        int? statusCode,
        bool? isSuccess,
        string? username,
        DateTime? fromDate,
        DateTime? toDate,
        int page,
        int pageSize,
        CancellationToken cancellationToken = default)
    {
        var query = context.AuditLogs
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(category) && !category.Equals("Tất cả", StringComparison.OrdinalIgnoreCase))
        {
            var cat = category.Trim();
            query = query.Where(x => x.Category == cat);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();
            query = query.Where(x =>
                x.Action.Contains(term) ||
                (x.EntityName != null && x.EntityName.Contains(term)) ||
                (x.EntityId != null && x.EntityId.Contains(term)) ||
                x.Path.Contains(term) ||
                x.Username.Contains(term) ||
                (x.UserRole != null && x.UserRole.Contains(term)) ||
                (x.IpAddress != null && x.IpAddress.Contains(term)) ||
                (x.Payload != null && x.Payload.Contains(term)) ||
                (x.ErrorMessage != null && x.ErrorMessage.Contains(term)));
        }

        if (!string.IsNullOrWhiteSpace(action))
        {
            var act = action.Trim();
            query = query.Where(x => x.Action.Contains(act));
        }

        if (!string.IsNullOrWhiteSpace(httpMethod))
        {
            var method = httpMethod.Trim().ToUpperInvariant();
            query = query.Where(x => x.HttpMethod == method);
        }

        if (statusCode.HasValue)
        {
            query = query.Where(x => x.StatusCode == statusCode.Value);
        }

        if (isSuccess.HasValue)
        {
            query = query.Where(x => x.IsSuccess == isSuccess.Value);
        }

        if (!string.IsNullOrWhiteSpace(username))
        {
            var user = username.Trim();
            query = query.Where(x => x.Username == user);
        }

        if (fromDate.HasValue)
        {
            query = query.Where(x => x.CreatedAt >= fromDate.Value || x.Timestamp >= fromDate.Value);
        }

        if (toDate.HasValue)
        {
            query = query.Where(x => x.CreatedAt <= toDate.Value || x.Timestamp <= toDate.Value);
        }

        query = query.OrderByDescending(x => x.CreatedAt);

        var total = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (items, total);
    }
}
