using MediatR;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;

namespace CloudServices.Application.Features.PlanPrices.Commands;

public record UpdatePlanPriceCommand(Guid PlanId, Guid PriceId, string BillingCycle, decimal Price, Guid? PromotionId) : IRequest<bool>;

public class UpdatePlanPriceCommandHandler : IRequestHandler<UpdatePlanPriceCommand, bool>
{
    private readonly IPlanPriceRepository _planPriceRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdatePlanPriceCommandHandler(IPlanPriceRepository planPriceRepository, IUnitOfWork unitOfWork)
    {
        _planPriceRepository = planPriceRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(UpdatePlanPriceCommand request, CancellationToken cancellationToken)
    {
        var planPrice = await _planPriceRepository.GetByIdAsync(request.PriceId, cancellationToken);

        if (planPrice == null || planPrice.PlanId != request.PlanId) return false;

        planPrice.BillingCycle = request.BillingCycle;
        planPrice.Price = request.Price;
        planPrice.PromotionId = request.PromotionId;

        _planPriceRepository.Update(planPrice);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }
}