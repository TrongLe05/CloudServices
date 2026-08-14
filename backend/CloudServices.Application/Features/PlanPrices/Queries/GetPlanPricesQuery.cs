using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Features.PlanPrices.DTOs;
using MediatR;

namespace CloudServices.Application.Features.PlanPrices.Queries;

public record GetPlanPricesQuery(Guid PlanId) : IRequest<List<PlanPriceDto>>;

public class GetPlanPricesQueryHandler : IRequestHandler<GetPlanPricesQuery, List<PlanPriceDto>>
{
    private readonly IPlanPriceRepository _repository;

    public GetPlanPricesQueryHandler(IPlanPriceRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<PlanPriceDto>> Handle(GetPlanPricesQuery request, CancellationToken cancellationToken)
    {
        var planPrices = await _repository.GetByPlanIdAsync(request.PlanId, cancellationToken);

        return planPrices.Select(p => new PlanPriceDto
        {
            Id = p.Id,
            PlanId = p.PlanId,
            BillingCycle = p.BillingCycle,
            Price = p.Price,
            PromotionId = p.PromotionId
        }).ToList();
    }
}