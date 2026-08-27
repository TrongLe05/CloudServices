using CloudServices.Application.Features.PlanPrices.DTOs;

namespace CloudServices.Application.Features.ServicePlans.Queries;

internal static class ServicePlanMapper
{
    internal static ServicePlanDto ToDto(Domain.Entities.ServicePlan plan) => new(
        plan.Id,
        plan.CategoryId,
        plan.Category?.Name,
        plan.Name,
        plan.Description,
        plan.Cpu,
        plan.Ram,
        plan.Storage,
        plan.Bandwidth,
        plan.QrCodeUrl,
        plan.CreatedAt,
        plan.PlanPrices?.Select(pr => new PlanPriceDto
        {
            Id = pr.Id,
            PlanId = pr.PlanId,
            BillingCycle = pr.BillingCycle,
            Price = pr.Price,
            PromotionId = pr.PromotionId,
            PromotionName = pr.Promotion?.Name,
            PromotionDiscountPercentage = pr.Promotion?.DiscountPercentage,
            FinalPrice = pr.Promotion != null && pr.Promotion.IsActive && pr.Promotion.DiscountPercentage > 0
                ? Math.Round(pr.Price * (100 - pr.Promotion.DiscountPercentage) / 100m, 2)
                : pr.Price
        }).ToList()
    );
}
