using CloudServices.Domain.Entities;
using CloudServices.Domain.Enums;

namespace CloudServices.Application.Common.Interfaces;

public interface IOrderRequestRepository
{
    Task<OrderRequest?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<(IReadOnlyList<OrderRequest> Items, int TotalCount)> GetAsync(
        string? search,
        OrderStatus? status,
        int page,
        int pageSize,
        string? sort,
        CancellationToken cancellationToken = default);
    Task AddAsync(OrderRequest orderRequest, CancellationToken cancellationToken = default);
    Task UpdateAsync(OrderRequest orderRequest, CancellationToken cancellationToken = default);
    Task DeleteAsync(OrderRequest orderRequest, CancellationToken cancellationToken = default);
}
