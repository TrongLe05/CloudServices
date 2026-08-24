using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Exceptions.BadRequestException;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using MediatR;
using Microsoft.Extensions.Configuration;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace CloudServices.Application.Features.Payments.Commands.CreatePayOSLink;

public sealed class CreatePayOSLinkCommandHandler(
    IOrderRequestRepository orderRepository,
    IPaymentGateway paymentGateway,
    IUnitOfWork unitOfWork,
    IConfiguration configuration
    ) : IRequestHandler<CreatePayOSLinkCommand, CreatePayOSLinkResponse>
{
    public async Task<CreatePayOSLinkResponse> Handle(CreatePayOSLinkCommand request, CancellationToken cancellationToken)
    {
        // 1. Kiểm tra đơn hàng trong DB
        var order = await orderRepository.GetByIdAsync(request.OrderId, cancellationToken)
            ?? throw new NotFoundException("Đơn hàng không tồn tại.");

        // 2. Tạo mã orderCode số nguyên duy nhất (VD: Timestamp)
        long orderCode = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

        // 3. Tính số tiền sau khi áp dụng giảm giá (nếu có)
        decimal rawPrice = order.PlanPrice?.Price ?? 0;
        int discount = 0;
        if (order.PlanPrice?.Promotion != null && order.PlanPrice.Promotion.IsActive)
        {
            discount = order.PlanPrice.Promotion.DiscountPercentage;
        }

        decimal finalAmount = discount > 0 ? rawPrice * (100 - discount) / 100m : rawPrice;
        int amount = (int)Math.Round(finalAmount);

        if (amount <= 0)
        {
            throw new BadRequestException("Gói dịch vụ này yêu cầu liên hệ trực tiếp để nhận báo giá riêng và không hỗ trợ thanh toán trực tuyến.");
        }

        string planName = order.PlanPrice?.Plan?.Name ?? "Gói Cloud Service";
        string description = $"DH{orderCode % 1000000}".Trim();

        var frontendBase = configuration["AppSettings:FrontendUrl"] ?? "http://localhost:3000";
        var returnUrl = string.IsNullOrWhiteSpace(request.ReturnUrl) ? $"{frontendBase}/don-hang?status=success" : request.ReturnUrl;
        var cancelUrl = string.IsNullOrWhiteSpace(request.CancelUrl) ? $"{frontendBase}/don-hang?status=cancelled" : request.CancelUrl;

        // Lưu orderCode và thời gian bắt đầu thanh toán vào đơn hàng
        order.Notes = $"PayOS:{orderCode}";
        order.LastModifiedAt = DateTime.UtcNow;
        orderRepository.Update(order);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        // 4. Gọi Gateway tạo link
        var paymentResult = await paymentGateway.CreatePaymentLinkAsync(
            orderCode,
            amount,
            description,
            planName,
            returnUrl,
            cancelUrl,
            cancellationToken
        );

        // Tạo VietQR template compact2 (có logo VietQR, NAPAS247 và ngân hàng)
        string? vietQrUrl = null;
        if (!string.IsNullOrEmpty(paymentResult.Bin) && !string.IsNullOrEmpty(paymentResult.AccountNumber))
        {
            vietQrUrl = $"https://img.vietqr.io/image/{paymentResult.Bin}-{paymentResult.AccountNumber}-compact2.png?amount={amount}&addInfo={Uri.EscapeDataString(description)}&accountName={Uri.EscapeDataString(paymentResult.AccountName ?? "")}";
        }

        return new CreatePayOSLinkResponse(
            paymentResult.CheckoutUrl,
            paymentResult.OrderCode,
            amount,
            description,
            paymentResult.QrCode,
            paymentResult.AccountNumber,
            paymentResult.AccountName,
            paymentResult.Bin,
            vietQrUrl
        );
    }
}