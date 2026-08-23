using CloudServices.Domain.Entities;
using CloudServices.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace CloudServices.Application.Common.Interfaces.Repositories;

public interface IOrderRequestRepository
{
    Task<OrderRequest?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<OrderRequest?> GetByPayOsOrderCodeAsync(long orderCode, CancellationToken cancellationToken = default);
    Task<(IReadOnlyList<OrderRequest> Items, int TotalCount)> GetPagedAsync(string? search, OrderStatus? status, string? sort, int page, int pageSize, string? customerEmail = null, CancellationToken cancellationToken = default);
    Task AddAsync(OrderRequest orderRequest, CancellationToken cancellationToken = default);
    void Update(OrderRequest orderRequest);
    void Delete(OrderRequest orderRequest);
    Task<IReadOnlyList<OrderRequest>> GetAllAsync(CancellationToken cancellationToken = default);
}
