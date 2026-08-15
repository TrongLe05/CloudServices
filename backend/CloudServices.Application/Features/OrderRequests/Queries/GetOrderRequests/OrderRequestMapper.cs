namespace CloudServices.Application.Features.OrderRequests.Queries.GetOrderRequests;
internal static class OrderRequestMapper
{ internal static OrderRequestDto ToDto(Domain.Entities.OrderRequest order) => new(order.Id, order.PlanPrice.PlanId, order.PlanPrice.Plan.Name, order.PlanPrice.BillingCycle, order.CustomerName, order.CustomerEmail, order.CustomerPhone, order.CompanyName, order.Status, order.CreatedAt); }
