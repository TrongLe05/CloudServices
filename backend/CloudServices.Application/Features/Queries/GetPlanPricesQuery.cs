using MediatR;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.PlanPrices.DTOs;

namespace CloudServices.Application.Features.PlanPrices.Queries;

public record GetPlanPricesQuery(Guid PlanId) : IRequest<List<PlanPriceDto>>;

public class GetPlanPricesQueryHandler : IRequestHandler<GetPlanPricesQuery, List<PlanPriceDto>>
{
    private readonly IPlanPriceRepository _planPriceRepository;

    public GetPlanPricesQueryHandler(IPlanPriceRepository planPriceRepository)
    {
        _planPriceRepository = planPriceRepository;
    }

    public async Task<List<PlanPriceDto>> Handle(GetPlanPricesQuery request, CancellationToken cancellationToken)
    {
        var prices = await _planPriceRepository.GetByPlanIdAsync(request.PlanId, cancellationToken);

        return prices.Select(p => new PlanPriceDto
        {
            Id = p.Id,
            PlanId = p.PlanId,
            BillingCycle = p.BillingCycle,
            Price = p.Price,
            PromotionId = p.PromotionId
        }).ToList();
    }
}