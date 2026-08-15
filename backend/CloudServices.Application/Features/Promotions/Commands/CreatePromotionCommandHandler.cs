using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.Promotions.DTOs;
using CloudServices.Domain.Entities;
using MediatR;

namespace CloudServices.Application.Features.Promotions.Commands;

public class CreatePromotionCommandHandler : IRequestHandler<CreatePromotionCommand, PromotionDto>
{
    private readonly IPromotionRepository _promotionRepository;

    public CreatePromotionCommandHandler(IPromotionRepository promotionRepository)
    {
        _promotionRepository = promotionRepository;
    }

    public async Task<PromotionDto> Handle(CreatePromotionCommand request, CancellationToken cancellationToken)
    {
        var promotion = new Promotion
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            DiscountPercentage = request.DiscountPercentage,
            StartDate = request.StartDate,
            EndDate = request.EndDate
        };

        await _promotionRepository.AddAsync(promotion, cancellationToken);

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