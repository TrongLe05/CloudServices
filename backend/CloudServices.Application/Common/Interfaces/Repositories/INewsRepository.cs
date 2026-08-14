using CloudServices.Domain.Entities;

namespace CloudServices.Application.Common.Interfaces.Repositories;

public interface INewsRepository
{
    Task<NewsArticle?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<(List<NewsArticle> Items, int Total)> GetPagedAsync(int page, int pageSize, string? search, string? category, string? sort, CancellationToken cancellationToken);
    Task AddAsync(NewsArticle article, CancellationToken cancellationToken);
    Task UpdateAsync(NewsArticle article, CancellationToken cancellationToken);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken);
}
