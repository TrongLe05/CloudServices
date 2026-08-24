using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Domain.Entities;
using CloudServices.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CloudServices.Infrastructure.Repositories;

public sealed class NewsRepository(ApplicationDbContext context) : INewsRepository
{
    public Task<NewsArticle?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        context.NewsArticles
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

    public async Task<(IReadOnlyList<NewsArticle> Items, int TotalCount)> GetPagedAsync(string? search, string? category, string? sort, int page, int pageSize, CancellationToken cancellationToken = default)
    {
        var query = context.NewsArticles
            .AsNoTracking()
            .AsQueryable();
        if (!string.IsNullOrWhiteSpace(search)) { var term = search.Trim(); query = query.Where(x => x.Title.Contains(term) || x.Content.Contains(term)); }
        if (!string.IsNullOrWhiteSpace(category)) query = query.Where(x => x.Category == category.Trim());
        query = string.Equals(sort, "createdAt", StringComparison.OrdinalIgnoreCase)
            ? query.OrderByDescending(x => x.CreatedAt)
            : query.OrderByDescending(x => x.PublishedAt ?? x.CreatedAt);
        var total = await query.CountAsync(cancellationToken);
        return (await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(cancellationToken), total);
    }

    public Task AddAsync(NewsArticle article, CancellationToken cancellationToken = default) => context.NewsArticles.AddAsync(article, cancellationToken).AsTask();
    public void Update(NewsArticle article) => context.NewsArticles.Update(article);
    public void Delete(NewsArticle article) => context.NewsArticles.Remove(article);
}
