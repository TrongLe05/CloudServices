using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Domain.Enums;
using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace CloudServices.Application.Features.Payments.Commands.ProcessPayOSWebhook;

public class ProcessPayOSWebhookCommandHandler : IRequestHandler<ProcessPayOSWebhookCommand, bool>
{
    private readonly IPaymentGateway _paymentGateway;
    private readonly IOrderRequestRepository _orderRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IEmailSender _emailSender;
    private readonly IEmailTemplateService _emailTemplateService;
    private readonly IConfiguration _configuration;
    private readonly ICacheService _cache;
    private readonly ILogger<ProcessPayOSWebhookCommandHandler> _logger;

    public ProcessPayOSWebhookCommandHandler(
        IPaymentGateway paymentGateway,
        IOrderRequestRepository orderRepository,
        IUnitOfWork unitOfWork,
        IEmailSender emailSender,
        IEmailTemplateService emailTemplateService,
        IConfiguration configuration,
        ICacheService cache,
        ILogger<ProcessPayOSWebhookCommandHandler> logger)
    {
        _paymentGateway = paymentGateway;
        _orderRepository = orderRepository;
        _unitOfWork = unitOfWork;
        _emailSender = emailSender;
        _emailTemplateService = emailTemplateService;
        _configuration = configuration;
        _cache = cache;
        _logger = logger;
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
            var matchedOrder = await _orderRepository.GetByPayOsOrderCodeAsync(verification.OrderCode, cancellationToken);
            
            if (matchedOrder != null && matchedOrder.Status == OrderStatus.New)
            {
                matchedOrder.Status = OrderStatus.Processing;
                _orderRepository.Update(matchedOrder);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                // Xóa cache link thanh toán cũ
                _cache.Remove($"payos_link_{matchedOrder.Id}");

                // 3. Gửi email xác nhận thanh toán & triển khai dịch vụ
                try
                {
                    var planName = matchedOrder.PlanPrice?.Plan?.Name ?? "Gói dịch vụ Cloud";
                    var billingCycle = matchedOrder.PlanPrice?.BillingCycle ?? "Hàng tháng";
                    var amount = matchedOrder.PlanPrice?.Price ?? 0m;
                    var frontendUrl = _configuration["AppSettings:FrontendUrl"] ?? "https://cloudservices.vn";

                    var emailSubject = $"[CloudServices] Xác nhận thanh toán thành công đơn hàng #{verification.OrderCode}";
                    var emailHtml = _emailTemplateService.GeneratePaymentSuccessEmail(
                        matchedOrder.CustomerName,
                        verification.OrderCode.ToString(),
                        planName,
                        billingCycle,
                        amount,
                        matchedOrder.Notes,
                        frontendUrl);

                    await _emailSender.SendEmailAsync(matchedOrder.CustomerEmail, emailSubject, emailHtml);
                    _logger.LogInformation("Đã gửi email xác nhận thanh toán cho khách hàng {Email}, đơn hàng #{OrderCode}", matchedOrder.CustomerEmail, verification.OrderCode);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Lỗi khi gửi email xác nhận thanh toán cho đơn hàng #{OrderCode}", verification.OrderCode);
                }
            }
        }

        return true;
    }
}