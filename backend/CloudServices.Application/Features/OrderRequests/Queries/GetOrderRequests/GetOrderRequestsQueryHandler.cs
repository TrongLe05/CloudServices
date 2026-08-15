using CloudServices.Application.Common.Exceptions.BadRequestException;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Domain.Enums;
using MediatR;
namespace CloudServices.Application.Features.OrderRequests.Queries.GetOrderRequests;
public sealed class GetOrderRequestsQueryHandler(IOrderRequestRepository repository) : IRequestHandler<GetOrderRequestsQuery, OrderRequestPage>
{ public async Task<OrderRequestPage> Handle(GetOrderRequestsQuery request, CancellationToken cancellationToken) { if (!string.IsNullOrWhiteSpace(request.Status) && !Enum.TryParse<OrderStatus>(request.Status, true, out _)) throw new BadRequestException("Invalid order status."); OrderStatus? status = Enum.TryParse<OrderStatus>(request.Status, true, out var parsed) ? parsed : null; var page = Math.Max(1, request.Page); var pageSize = Math.Clamp(request.PageSize, 1, 100); var (items, total) = await repository.GetPagedAsync(request.Search, status, request.Sort, page, pageSize, cancellationToken); return new OrderRequestPage(items.Select(OrderRequestMapper.ToDto).ToList(), page, pageSize, total); } }
