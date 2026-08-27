using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.Promotions.DTOs;
using MediatR;

namespace CloudServices.Application.Features.Promotions.Queries;

public class GetPromotionByIdQueryHandler : IRequestHandler<GetPromotionByIdQuery, PromotionDto?>
{
    private readonly IPromotionRepository _promotionRepository;
    private readonly ICacheService _cache;

    public GetPromotionByIdQueryHandler(IPromotionRepository promotionRepository, ICacheService cache)
    {
        _promotionRepository = promotionRepository;
        _cache = cache;
    }

    public async Task<PromotionDto?> Handle(GetPromotionByIdQuery request, CancellationToken cancellationToken)
    {
        return await _cache.GetOrCreateAsync(
            $"promotions:id_{request.Id}",
            async ct =>
            {
                var promotion = await _promotionRepository.GetByIdAsync(request.Id, ct);
                if (promotion == null) return null;

                return new PromotionDto
                {
                    Id = promotion.Id,
                    Name = promotion.Name,
                    DiscountPercentage = promotion.DiscountPercentage,
                    StartDate = promotion.StartDate,
                    EndDate = promotion.EndDate,
                    IsActive = DateTime.UtcNow >= promotion.StartDate && DateTime.UtcNow <= promotion.EndDate
                };
            },
            TimeSpan.FromMinutes(2),
            cancellationToken);
    }
}