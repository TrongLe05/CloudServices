using MediatR;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Domain.Entities;

namespace CloudServices.Application.Features.PlanPrices.Commands;

public record CreatePlanPriceCommand(Guid PlanId, string BillingCycle, decimal Price, Guid? PromotionId) : IRequest<Guid>;

public class CreatePlanPriceCommandHandler : IRequestHandler<CreatePlanPriceCommand, Guid>
{
    private readonly IPlanPriceRepository _planPriceRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreatePlanPriceCommandHandler(IPlanPriceRepository planPriceRepository, IUnitOfWork unitOfWork)
    {
        _planPriceRepository = planPriceRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(CreatePlanPriceCommand request, CancellationToken cancellationToken)
    {
        var planPrice = new PlanPrice
        {
            Id = Guid.NewGuid(),
            PlanId = request.PlanId,
            BillingCycle = request.BillingCycle,
            Price = request.Price,
            PromotionId = request.PromotionId
        };

        await _planPriceRepository.AddAsync(planPrice, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return planPrice.Id;
    }
}