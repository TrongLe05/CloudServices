using System;

namespace CloudServices.Application.Features.PlanPrices.DTOs;

public class PlanPriceDto
{
    public Guid Id { get; set; }
    public Guid PlanId { get; set; }
    public string BillingCycle { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public Guid? PromotionId { get; set; }
    public string? PromotionName { get; set; }
    public int? PromotionDiscountPercentage { get; set; }
    public decimal FinalPrice { get; set; }
}