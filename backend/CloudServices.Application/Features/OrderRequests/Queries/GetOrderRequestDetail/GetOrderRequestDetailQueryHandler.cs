using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Features.OrderRequests;
using MediatR;

namespace CloudServices.Application.Features.OrderRequests.Queries.GetOrderRequestDetail;

public class GetOrderRequestDetailQueryHandler : IRequestHandler<GetOrderRequestDetailQuery, OrderRequestDetailDto?>
{
    private readonly IOrderRequestRepository _repository;

    public GetOrderRequestDetailQueryHandler(IOrderRequestRepository repository)
    {
        _repository = repository;
    }

    public async Task<OrderRequestDetailDto?> Handle(GetOrderRequestDetailQuery request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetByIdAsync(request.Id, cancellationToken);
        if (entity is null)
        {
            return null;
        }

        return new OrderRequestDetailDto(
            entity.Id,
            entity.PlanPrice.Plan.Id,
            entity.PlanPrice.Plan.Name,
            entity.PlanPrice.BillingCycle,
            entity.PlanPrice.Price,
            entity.CustomerName,
            entity.CustomerEmail,
            entity.CustomerPhone,
            entity.CompanyName,
            entity.Status.ToString(),
            entity.Notes,
            entity.CreatedAt,
            entity.LastModifiedAt);
    }
}
