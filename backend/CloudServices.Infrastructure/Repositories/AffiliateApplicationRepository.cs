using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Domain.Entities;
using CloudServices.Domain.Enums;
using CloudServices.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CloudServices.Infrastructure.Repositories;

public sealed class AffiliateApplicationRepository(ApplicationDbContext context) : IAffiliateApplicationRepository
{
    public async Task AddAsync(AffiliateApplication application, CancellationToken cancellationToken)
    {
        await context.AffiliateApplications.AddAsync(application, cancellationToken);
    }

    public void Delete(AffiliateApplication application) => context.AffiliateApplications.Remove(application);

    public async Task<AffiliateApplication?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
       return await context.AffiliateApplications.FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
    }

    public async Task<(IReadOnlyList<AffiliateApplication> item, int total)> GetPagedAsync(string? search, AffiliateStatus? status, string? sort, int page, int pageSize, CancellationToken cancellationToken = default)
    {
        var query = context.AffiliateApplications
        .Where(a =>
            (string.IsNullOrEmpty(search) ||
             a.FullName.Contains(search) ||
             a.Email.Contains(search)) &&
            (!status.HasValue || a.Status == status.Value));

        var total = await query.CountAsync(cancellationToken);

        query = sort switch
        {
            "name_asc" => query.OrderBy(a => a.FullName),
            "name_desc" => query.OrderByDescending(a => a.FullName),
            "oldest" => query.OrderBy(a => a.CreatedAt),
            _ => query.OrderByDescending(a => a.CreatedAt)
        };


        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (items.AsReadOnly(), total);
    }

    public void Update(AffiliateApplication application) => context.AffiliateApplications.Update(application);
}
