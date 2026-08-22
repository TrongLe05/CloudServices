using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Domain.Enums;
using MediatR;

namespace CloudServices.Application.Features.Payments.Commands.ProcessPayOSWebhook;

public class ProcessPayOSWebhookCommandHandler : IRequestHandler<ProcessPayOSWebhookCommand, bool>
{
    private readonly IPaymentGateway _paymentGateway;
    private readonly IOrderRequestRepository _orderRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ProcessPayOSWebhookCommandHandler(
        IPaymentGateway paymentGateway,
        IOrderRequestRepository orderRepository,
        IUnitOfWork unitOfWork)
    {
        _paymentGateway = paymentGateway;
        _orderRepository = orderRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(ProcessPayOSWebhookCommand request, CancellationToken cancellationToken)
    {
        // 1. Xác thực Checksum Webhook
        var verification = _paymentGateway.VerifyWebhook(request.WebhookPayload);
        if (!verification.IsValid)
        {
            return false;
        }

        // 2. Kiểm tra nếu trạng thái chuyển khoản thành công ("00")
        if (verification.Code == "00")
        {
            // Cập nhật trạng thái đơn hàng sang Processing (Đang xử lý để kỹ thuật/admin triển khai)
            var allOrders = await _orderRepository.GetAllAsync(cancellationToken);
            var matchedOrder = allOrders.FirstOrDefault(o => o.Notes == $"PayOS:{verification.OrderCode}");
            
            if (matchedOrder != null && matchedOrder.Status == OrderStatus.New)
            {
                matchedOrder.Status = OrderStatus.Processing;
                _orderRepository.Update(matchedOrder);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
            }
        }

        return true;
    }
}