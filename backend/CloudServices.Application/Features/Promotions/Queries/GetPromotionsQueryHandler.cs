using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.Promotions.DTOs;
using MediatR;

namespace CloudServices.Application.Features.Promotions.Queries;

public class GetPromotionsQueryHandler : IRequestHandler<GetPromotionsQuery, List<PromotionDto>>
{
    private readonly IPromotionRepository _promotionRepository;

    public GetPromotionsQueryHandler(IPromotionRepository promotionRepository)
    {
        _promotionRepository = promotionRepository;
    }

    public async Task<List<PromotionDto>> Handle(GetPromotionsQuery request, CancellationToken cancellationToken)
    {
        var promotions = await _promotionRepository.GetAllAsync(cancellationToken);

        var now = DateTime.UtcNow;
        return promotions.Select(p => new PromotionDto
        {
            Id = p.Id,
            Name = p.Name,
            DiscountPercentage = p.DiscountPercentage,
            StartDate = p.StartDate,
            EndDate = p.EndDate,
            IsActive = now >= p.StartDate && now <= p.EndDate
        }).ToList();
    }
}