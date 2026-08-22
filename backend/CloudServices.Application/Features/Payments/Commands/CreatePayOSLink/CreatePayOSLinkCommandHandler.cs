using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using MediatR;

namespace CloudServices.Application.Features.Payments.Commands.CreatePayOSLink;

public sealed class CreatePayOSLinkCommandHandler (
    IOrderRequestRepository orderRepository,
    IPaymentGateway paymentGateway
    ) : IRequestHandler<CreatePayOSLinkCommand, CreatePayOSLinkResponse>
{

    public async Task<CreatePayOSLinkResponse> Handle(CreatePayOSLinkCommand request, CancellationToken cancellationToken)
    {
        // 1. Kiểm tra đơn hàng trong DB
        var order = await orderRepository.GetByIdAsync(request.OrderId, cancellationToken)
            ?? throw new NotFoundException("Đơn hàng không tồn tại.");

        // 2. Tạo mã orderCode số nguyên duy nhất (VD: Timestamp)
        long orderCode = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

        // 3. Tính số tiền và tên gói
        int amount = (int)(order.PlanPrice?.Price ?? 0);
        string planName = order.PlanPrice?.Plan?.Name ?? "Gói Cloud Service";
        string description = $"DH{orderCode % 1000000}".Trim();

        // 4. Gọi Gateway tạo link
        var paymentResult = await paymentGateway.CreatePaymentLinkAsync(
            orderCode,
            amount,
            description,
            planName,
            request.ReturnUrl,
            request.CancelUrl,
            cancellationToken
        );

        return new CreatePayOSLinkResponse(
            paymentResult.CheckoutUrl,
            paymentResult.OrderCode,
            paymentResult.QrCode
        );
    }
}