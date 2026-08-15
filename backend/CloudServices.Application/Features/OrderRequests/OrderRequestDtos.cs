using CloudServices.Domain.Enums;

namespace CloudServices.Application.Features.OrderRequests;

public sealed record OrderRequestDto(Guid Id, Guid ServicePlanId, string ServicePlanName, string BillingCycle, string CustomerName, string Email, string Phone, string? CompanyName, OrderStatus Status, DateTime CreatedAt);
public sealed record OrderRequestPage(IReadOnlyList<OrderRequestDto> Items, int Page, int PageSize, int TotalCount);
