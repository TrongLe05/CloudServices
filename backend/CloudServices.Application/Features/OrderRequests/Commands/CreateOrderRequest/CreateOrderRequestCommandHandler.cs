using CloudServices.Application.Common.Interfaces;
using CloudServices.Domain.Entities;
using CloudServices.Domain.Enums;
using MediatR;

namespace CloudServices.Application.Features.OrderRequests.Commands.CreateOrderRequest;

public class CreateOrderRequestCommandHandler : IRequestHandler<CreateOrderRequestCommand, Guid>
{
    private readonly IOrderRequestRepository _orderRequestRepository;
    private readonly IPlanPriceRepository _planPriceRepository;

    public CreateOrderRequestCommandHandler(
        IOrderRequestRepository orderRequestRepository,
        IPlanPriceRepository planPriceRepository)
    {
        _orderRequestRepository = orderRequestRepository;
        _planPriceRepository = planPriceRepository;
    }

    public async Task<Guid> Handle(CreateOrderRequestCommand request, CancellationToken cancellationToken)
    {
        var planPrice = await _planPriceRepository.GetByServicePlanIdAndBillingCycleAsync(
            request.ServicePlanId,
            request.BillingCycle,
            cancellationToken);

        if (planPrice is null)
        {
            throw new InvalidOperationException("Không tìm thấy gói dịch vụ phù hợp với chu kỳ thanh toán đã chọn.");
        }

        var entity = new OrderRequest
        {
            PlanPriceId = planPrice.Id,
            CustomerName = request.CustomerName,
            CustomerEmail = request.Email,
            CustomerPhone = request.Phone,
            CompanyName = request.CompanyName,
            Status = OrderStatus.New,
            Notes = null
        };

        await _orderRequestRepository.AddAsync(entity, cancellationToken);
        return entity.Id;
    }
}
