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
    IConfiguration configuration,
    ICacheService cache
    ) : IRequestHandler<CreatePayOSLinkCommand, CreatePayOSLinkResponse>
{
    public async Task<CreatePayOSLinkResponse> Handle(CreatePayOSLinkCommand request, CancellationToken cancellationToken)
    {
        var cacheKey = $"payos_link_{request.OrderId}";

        // 1. Tận dụng mã thanh toán cũ đã tạo nếu còn hiệu lực (< 4 phút)
        var cachedResponse = await cache.GetAsync<CreatePayOSLinkResponse>(cacheKey, cancellationToken);
        if (cachedResponse != null)
        {
            return cachedResponse;
        }

        // 2. Kiểm tra đơn hàng trong DB
        var order = await orderRepository.GetByIdAsync(request.OrderId, cancellationToken)
            ?? throw new NotFoundException("Đơn hàng không tồn tại.");

        if (order.Status != Domain.Enums.OrderStatus.New)
        {
            throw new BadRequestException("Đơn hàng này không ở trạng thái chờ thanh toán.");
        }

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

        // 4. Gọi Gateway tạo link trước khi ghi DB
        var paymentResult = await paymentGateway.CreatePaymentLinkAsync(
            orderCode,
            amount,
            description,
            planName,
            returnUrl,
            cancelUrl,
            cancellationToken
        );

        // 5. Sau khi tạo link PayOS thành công, cập nhật orderCode và thời gian bắt đầu thanh toán vào đơn hàng
        order.Notes = $"PayOS:{orderCode}";
        order.LastModifiedAt = DateTime.UtcNow;
        orderRepository.Update(order);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        // Tạo VietQR template compact2 (có logo VietQR, NAPAS247 và ngân hàng)
        string? vietQrUrl = null;
        if (!string.IsNullOrEmpty(paymentResult.Bin) && !string.IsNullOrEmpty(paymentResult.AccountNumber))
        {
            vietQrUrl = $"https://img.vietqr.io/image/{paymentResult.Bin}-{paymentResult.AccountNumber}-compact2.png?amount={amount}&addInfo={Uri.EscapeDataString(description)}&accountName={Uri.EscapeDataString(paymentResult.AccountName ?? "")}";
        }

        var response = new CreatePayOSLinkResponse(
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

        // Lưu vào Cache 4 phút để phục vụ tức thì nếu người dùng mở lại modal
        await cache.GetOrCreateAsync(cacheKey, _ => Task.FromResult(response), TimeSpan.FromMinutes(4), cancellationToken);

        return response;
    }
}