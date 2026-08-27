using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.Promotions.DTOs;
using CloudServices.Domain.Entities;
using MediatR;

namespace CloudServices.Application.Features.Promotions.Commands;

public class CreatePromotionCommandHandler : IRequestHandler<CreatePromotionCommand, PromotionDto>
{
    private readonly IPromotionRepository _promotionRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICacheService _cache;

    public CreatePromotionCommandHandler(
        IPromotionRepository promotionRepository,
        IUnitOfWork unitOfWork,
        ICacheService cache)
    {
        _promotionRepository = promotionRepository;
        _unitOfWork = unitOfWork;
        _cache = cache;
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
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _cache.RemoveByPrefix("promotions");
        _cache.RemoveByPrefix("plans");

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