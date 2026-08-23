using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.PlanPrices.DTOs;
using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

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

        return planPrices.Select(p =>
        {
            var discount = p.Promotion != null && p.Promotion.IsActive ? p.Promotion.DiscountPercentage : 0;
            var finalPrice = discount > 0 ? p.Price * (100 - discount) / 100m : p.Price;

            return new PlanPriceDto
            {
                Id = p.Id,
                PlanId = p.PlanId,
                BillingCycle = p.BillingCycle,
                Price = p.Price,
                PromotionId = p.PromotionId,
                PromotionName = p.Promotion?.Name,
                PromotionDiscountPercentage = discount > 0 ? discount : null,
                FinalPrice = finalPrice
            };
        }).ToList();
    }
}