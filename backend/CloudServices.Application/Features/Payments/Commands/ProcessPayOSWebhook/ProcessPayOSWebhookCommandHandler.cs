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
            // Cập nhật trạng thái đơn hàng (Completed / Approved)
            // var order = await _orderRepository.GetByOrderCodeAsync(verification.OrderCode, cancellationToken);
            // if (order != null)
            // {
            //     order.Status = OrderStatus.Completed;
            //     await _unitOfWork.SaveChangesAsync(cancellationToken);
            // }
        }

        return true;
    }
}