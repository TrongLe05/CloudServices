using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using MediatR;

namespace CloudServices.Application.Features.Promotions.Commands;

public class DeletePromotionCommandHandler : IRequestHandler<DeletePromotionCommand, bool>
{
    private readonly IPromotionRepository _promotionRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeletePromotionCommandHandler(
        IPromotionRepository promotionRepository,
        IUnitOfWork unitOfWork)
    {
        _promotionRepository = promotionRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(DeletePromotionCommand request, CancellationToken cancellationToken)
    {
        var promotion = await _promotionRepository.GetByIdAsync(request.Id, cancellationToken);
        if (promotion == null) return false;

        _promotionRepository.Delete(promotion);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return true;
    }
}