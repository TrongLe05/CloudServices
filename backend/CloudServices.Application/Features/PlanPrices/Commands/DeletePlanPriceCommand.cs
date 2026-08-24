using MediatR;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;

namespace CloudServices.Application.Features.PlanPrices.Commands;

public record DeletePlanPriceCommand(Guid PlanId, Guid PriceId) : IRequest<bool>;

public class DeletePlanPriceCommandHandler : IRequestHandler<DeletePlanPriceCommand, bool>
{
    private readonly IPlanPriceRepository _planPriceRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICacheService _cache;

    public DeletePlanPriceCommandHandler(IPlanPriceRepository planPriceRepository, IUnitOfWork unitOfWork, ICacheService cache)
    {
        _planPriceRepository = planPriceRepository;
        _unitOfWork = unitOfWork;
        _cache = cache;
    }

    public async Task<bool> Handle(DeletePlanPriceCommand request, CancellationToken cancellationToken)
    {
        var planPrice = await _planPriceRepository.GetByIdAsync(request.PriceId, cancellationToken);

        if (planPrice == null || planPrice.PlanId != request.PlanId) return false;

        _planPriceRepository.Delete(planPrice);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _cache.RemoveByPrefix("plans");

        return true;
    }
}