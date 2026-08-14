using MediatR;
using CloudServices.Application.Common.Interfaces;

namespace CloudServices.Application.Features.PlanPrices.Commands;

public record DeletePlanPriceCommand(Guid PlanId, Guid PriceId) : IRequest<bool>;

public class DeletePlanPriceCommandHandler : IRequestHandler<DeletePlanPriceCommand, bool>
{
    private readonly IPlanPriceRepository _planPriceRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeletePlanPriceCommandHandler(IPlanPriceRepository planPriceRepository, IUnitOfWork unitOfWork)
    {
        _planPriceRepository = planPriceRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(DeletePlanPriceCommand request, CancellationToken cancellationToken)
    {
        var planPrice = await _planPriceRepository.GetByIdAsync(request.PriceId, cancellationToken);

        if (planPrice == null || planPrice.PlanId != request.PlanId) return false;

        _planPriceRepository.Delete(planPrice);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }
}