using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using MediatR;

namespace CloudServices.Application.Features.Promotions.Commands;

public class DeletePromotionCommandHandler : IRequestHandler<DeletePromotionCommand, bool>
{
    private readonly IPromotionRepository _promotionRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICacheService _cache;

    public DeletePromotionCommandHandler(
        IPromotionRepository promotionRepository,
        IUnitOfWork unitOfWork,
        ICacheService cache)
    {
        _promotionRepository = promotionRepository;
        _unitOfWork = unitOfWork;
        _cache = cache;
    }

    public async Task<bool> Handle(DeletePromotionCommand request, CancellationToken cancellationToken)
    {
        var promotion = await _promotionRepository.GetByIdAsync(request.Id, cancellationToken);
        if (promotion == null) return false;

        _promotionRepository.Delete(promotion);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _cache.RemoveByPrefix("promotions");
        _cache.RemoveByPrefix("plans");

        return true;
    }
}