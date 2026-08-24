using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.Promotions.DTOs;
using MediatR;

namespace CloudServices.Application.Features.Promotions.Queries;

public class GetPromotionsQueryHandler : IRequestHandler<GetPromotionsQuery, List<PromotionDto>>
{
    private readonly IPromotionRepository _promotionRepository;
    private readonly ICacheService _cache;

    public GetPromotionsQueryHandler(IPromotionRepository promotionRepository, ICacheService cache)
    {
        _promotionRepository = promotionRepository;
        _cache = cache;
    }

    public async Task<List<PromotionDto>> Handle(GetPromotionsQuery request, CancellationToken cancellationToken)
    {
        return await _cache.GetOrCreateAsync(
            "promotions:all",
            async ct =>
            {
                var promotions = await _promotionRepository.GetAllAsync(ct);
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
            },
            TimeSpan.FromMinutes(2),
            cancellationToken);
    }
}