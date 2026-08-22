using CloudServices.Domain.Entities;
using CloudServices.Domain.Enums;

namespace CloudServices.Application.Common.Interfaces.Repositories;

public interface IAffiliateApplicationRepository
{
    Task<AffiliateApplication?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<AffiliateApplication?> GetByEmailAsync(string email, CancellationToken cancellationToken);
    Task<(IReadOnlyList<AffiliateApplication> item, int total)> GetPagedAsync(string? search, AffiliateStatus? status, string? sort, int page, int pageSize, CancellationToken cancellationToken = default);
    Task AddAsync(AffiliateApplication application, CancellationToken cancellationToken);
    void Update(AffiliateApplication application);
    void Delete(AffiliateApplication application);
}
