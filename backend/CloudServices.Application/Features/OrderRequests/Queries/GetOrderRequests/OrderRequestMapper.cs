using CloudServices.Application.Features.OrderRequests;
using System;

namespace CloudServices.Application.Features.OrderRequests.Queries.GetOrderRequests;

internal static class OrderRequestMapper
{
    internal static OrderRequestDto ToDto(Domain.Entities.OrderRequest order)
    {
        decimal rawPrice = order.PlanPrice?.Price ?? 0;
        int discount = 0;
        if (order.PlanPrice?.Promotion != null && order.PlanPrice.Promotion.IsActive)
        {
            discount = order.PlanPrice.Promotion.DiscountPercentage;
        }
        decimal finalPrice = discount > 0 ? rawPrice * (100 - discount) / 100m : rawPrice;

        return new OrderRequestDto(
            order.Id,
            order.PlanPrice?.PlanId ?? Guid.Empty,
            order.PlanPrice?.Plan?.Name ?? "Gói Cloud Service",
            order.PlanPrice?.BillingCycle ?? "Monthly",
            order.CustomerName,
            order.CustomerEmail,
            order.CustomerPhone,
            order.CompanyName,
            order.Status,
            DateTime.SpecifyKind(order.CreatedAt, DateTimeKind.Utc),
            finalPrice
        );
    }
}
