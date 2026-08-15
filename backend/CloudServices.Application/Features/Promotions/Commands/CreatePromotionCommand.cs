using CloudServices.Application.Features.Promotions.DTOs;
using MediatR;

namespace CloudServices.Application.Features.Promotions.Commands;

public record CreatePromotionCommand(
    string Name,
    int DiscountPercentage,
    DateTime StartDate,
    DateTime EndDate,
    bool IsActive
) : IRequest<PromotionDto>;