using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.Promotions.DTOs;
using MediatR;

namespace CloudServices.Application.Features.Promotions.Commands;

public class UpdatePromotionCommandHandler : IRequestHandler<UpdatePromotionCommand, PromotionDto?>
{
    private readonly IPromotionRepository _promotionRepository;

    public UpdatePromotionCommandHandler(IPromotionRepository promotionRepository)
    {
        _promotionRepository = promotionRepository;
    }

    public async Task<PromotionDto?> Handle(UpdatePromotionCommand request, CancellationToken cancellationToken)
    {
        var promotion = await _promotionRepository.GetByIdAsync(request.Id, cancellationToken);
        if (promotion == null) return null;

        promotion.Name = request.Name;
        promotion.DiscountPercentage = request.DiscountPercentage;
        promotion.StartDate = request.StartDate;
        promotion.EndDate = request.EndDate;

        _promotionRepository.Update(promotion);

        return new PromotionDto
        {
            Id = promotion.Id,
            Name = promotion.Name,
            DiscountPercentage = promotion.DiscountPercentage,
            StartDate = promotion.StartDate,
            EndDate = promotion.EndDate,
            IsActive = DateTime.UtcNow >= promotion.StartDate && DateTime.UtcNow <= promotion.EndDate
        };
    }
}