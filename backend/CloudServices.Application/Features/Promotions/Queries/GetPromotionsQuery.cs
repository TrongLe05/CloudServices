using MediatR;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.Promotions.DTOs;

namespace CloudServices.Application.Features.Promotions.Queries;

// 1. Get All Promotions
public record GetPromotionsQuery : IRequest<List<PromotionDto>>;

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
        return promotions.Select(p => new PromotionDto
        {
            Id = p.Id,
            Name = p.Name,
            DiscountPercentage = p.DiscountPercentage,
            StartDate = p.StartDate,
            EndDate = p.EndDate,
            IsActive = p.IsActive
        }).ToList();
    }
}

// 2. Get Promotion By Id
public record GetPromotionByIdQuery(Guid Id) : IRequest<PromotionDto?>;

public class GetPromotionByIdQueryHandler : IRequestHandler<GetPromotionByIdQuery, PromotionDto?>
{
    private readonly IPromotionRepository _promotionRepository;

    public GetPromotionByIdQueryHandler(IPromotionRepository promotionRepository)
    {
        _promotionRepository = promotionRepository;
    }

    public async Task<PromotionDto?> Handle(GetPromotionByIdQuery request, CancellationToken cancellationToken)
    {
        var p = await _promotionRepository.GetByIdAsync(request.Id, cancellationToken);
        if (p == null) return null;

        return new PromotionDto
        {
            Id = p.Id,
            Name = p.Name,
            DiscountPercentage = p.DiscountPercentage,
            StartDate = p.StartDate,
            EndDate = p.EndDate,
            IsActive = p.IsActive
        };
    }
}