using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Exceptions.BadRequestException;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Domain.Enums;
using MediatR;

namespace CloudServices.Application.Features.OrderRequests.Queries;

public sealed record GetOrderRequestsQuery(string? Search, string? Status, string? Sort, int Page = 1, int PageSize = 10) : IRequest<OrderRequestPage>;
public sealed record GetOrderRequestByIdQuery(Guid Id) : IRequest<OrderRequestDto>;
public sealed class GetOrderRequestsQueryHandler(IOrderRequestRepository repository) : IRequestHandler<GetOrderRequestsQuery, OrderRequestPage>
{
    public async Task<OrderRequestPage> Handle(GetOrderRequestsQuery r, CancellationToken ct)
    {
        if (!string.IsNullOrWhiteSpace(r.Status) && !Enum.TryParse<OrderStatus>(r.Status, true, out _)) throw new BadRequestException("Invalid order status.");
        OrderStatus? status = Enum.TryParse<OrderStatus>(r.Status, true, out var parsed) ? parsed : null;
        var page = Math.Max(1, r.Page); var pageSize = Math.Clamp(r.PageSize, 1, 100);
        var (items, total) = await repository.GetPagedAsync(r.Search, status, r.Sort, page, pageSize, ct);
        return new OrderRequestPage(items.Select(Map).ToList(), page, pageSize, total);
    }
    internal static OrderRequestDto Map(Domain.Entities.OrderRequest x) => new(x.Id, x.PlanPrice.PlanId, x.PlanPrice.Plan.Name, x.PlanPrice.BillingCycle, x.CustomerName, x.CustomerEmail, x.CustomerPhone, x.CompanyName, x.Status, x.CreatedAt);
}
public sealed class GetOrderRequestByIdQueryHandler(IOrderRequestRepository repository) : IRequestHandler<GetOrderRequestByIdQuery, OrderRequestDto>
{
    public async Task<OrderRequestDto> Handle(GetOrderRequestByIdQuery r, CancellationToken ct) => GetOrderRequestsQueryHandler.Map(await repository.GetByIdAsync(r.Id, ct) ?? throw new NotFoundException("Order request was not found."));
}
