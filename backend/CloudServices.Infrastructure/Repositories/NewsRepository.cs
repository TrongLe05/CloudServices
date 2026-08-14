using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CloudServices.Infrastructure.Repositories;

public class NewsRepository : INewsRepository
{
    private readonly IApplicationDbContext _context;
    public NewsRepository(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(NewsArticle article, CancellationToken cancellationToken)
    {
        await _context.NewsArticles.AddAsync(article, cancellationToken);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var entity = await _context.NewsArticles.FirstOrDefaultAsync(n => n.Id == id, cancellationToken);
        if (entity != null)
        {
            _context.NewsArticles.Remove(entity);
        }
    }

    public async Task<NewsArticle?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _context.NewsArticles.FirstOrDefaultAsync(n => n.Id == id, cancellationToken);
    }

    public async Task<(List<NewsArticle> Items, int Total)> GetPagedAsync(int page, int pageSize, string? search, string? category, string? sort, CancellationToken cancellationToken)
    {
        var query = _context.NewsArticles.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(n => n.Title.Contains(search) || n.Content.Contains(search));
        }

        // If category filtering is requested but entity doesn't have category, this will be ignored.
        // Keep placeholder for future Category support.

        // Sorting
        if (!string.IsNullOrWhiteSpace(sort) && sort.Equals("createdAt", StringComparison.OrdinalIgnoreCase))
        {
            query = query.OrderByDescending(n => n.CreatedAt);
        }
        else if (!string.IsNullOrWhiteSpace(sort) && sort.Equals("publishedAt", StringComparison.OrdinalIgnoreCase))
        {
            query = query.OrderByDescending(n => n.PublishedAt);
        }
        else
        {
            query = query.OrderByDescending(n => n.PublishedAt ?? n.CreatedAt);
        }

        var total = await query.CountAsync(cancellationToken);
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(cancellationToken);

        return (items, total);
    }

    public Task UpdateAsync(NewsArticle article, CancellationToken cancellationToken)
    {
        _context.NewsArticles.Update(article);
        return Task.CompletedTask;
    }
}
