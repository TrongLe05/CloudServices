using CloudServices.Domain.Entities;

namespace CloudServices.Application.Common.Interfaces.Repositories;

public interface INewsRepository
{
    Task<NewsArticle?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<(IReadOnlyList<NewsArticle> Items, int TotalCount)> GetPagedAsync(string? search, string? category, string? sort, int page, int pageSize, CancellationToken cancellationToken = default);
    Task AddAsync(NewsArticle article, CancellationToken cancellationToken = default);
    void Update(NewsArticle article);
    void Delete(NewsArticle article);
}
