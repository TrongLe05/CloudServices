using CloudServices.Application.Features.PlanPrices.DTOs;

namespace CloudServices.Application.Features.ServicePlans;

public sealed record ServicePlanDto(
    Guid Id, Guid CategoryId, string? CategoryName, string Name, string? Description,
    string? Cpu, string? Ram, string? Storage, string? Bandwidth, string? QrCodeUrl,
    DateTime CreatedAt,
    IReadOnlyList<PlanPriceDto>? Prices = null);
