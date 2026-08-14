using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Features.OrderRequests;
using CloudServices.Domain.Enums;
using MediatR;

namespace CloudServices.Application.Features.OrderRequests.Queries.GetOrderRequests;

public class GetOrderRequestsQueryHandler : IRequestHandler<GetOrderRequestsQuery, List<OrderRequestDto>>
{
    private readonly IOrderRequestRepository _repository;

    public GetOrderRequestsQueryHandler(IOrderRequestRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<OrderRequestDto>> Handle(GetOrderRequestsQuery request, CancellationToken cancellationToken)
    {
        OrderStatus? status = null;

        if (!string.IsNullOrWhiteSpace(request.Status))
        {
            if (!Enum.TryParse<OrderStatus>(request.Status, true, out var parsedStatus))
            {
                throw new ArgumentException("Trạng thái không hợp lệ.");
            }

            status = parsedStatus;
        }

        var result = await _repository.GetAsync(
            request.Search,
            status,
            request.Page,
            request.PageSize,
            request.Sort,
            cancellationToken);

        var items = result.Items;

        return items.Select(x => new OrderRequestDto(
            x.Id,
            x.PlanPrice.Plan.Id,
            x.PlanPrice.Plan.Name,
            x.PlanPrice.BillingCycle,
            x.PlanPrice.Price,
            x.CustomerName,
            x.CustomerEmail,
            x.CustomerPhone,
            x.CompanyName,
            x.Status.ToString(),
            x.CreatedAt)).ToList();
    }
}
