using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.Payments.Commands.CreatePayOSLink;
using CloudServices.Application.Features.Payments.Commands.ProcessPayOSWebhook;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CloudServices.API.Controllers;

[Route("api/payments")]
public class PaymentsController : ApiControllerBase
{
    [HttpPost("create-payos-link")]
    [Authorize]
    public async Task<IActionResult> CreatePayOSLink([FromBody] CreatePayOSLinkCommand command)
    {
        var result = await Mediator.Send(command);
        return Ok(result);
    }

    [HttpGet("status/{orderCode:long}")]
    [Authorize]
    public async Task<IActionResult> GetPaymentStatus(
        long orderCode,
        [FromServices] IPaymentGateway paymentGateway,
        [FromServices] IOrderRequestRepository orderRepository,
        [FromServices] IUnitOfWork unitOfWork,
        [FromServices] IEmailSender emailSender,
        [FromServices] IEmailTemplateService emailTemplateService,
        [FromServices] IConfiguration configuration,
        [FromServices] ILogger<PaymentsController> logger,
        CancellationToken cancellationToken)
    {
        try
        {
            var statusDto = await paymentGateway.GetPaymentStatusAsync(orderCode, cancellationToken);
            
            var matchedOrder = await orderRepository.GetByPayOsOrderCodeAsync(orderCode, cancellationToken);

            if (matchedOrder != null)
            {
                // Nếu đã thanh toán thành công, tự động đồng bộ đơn hàng sang Processing (Đang xử lý)
                if (statusDto.IsPaid && matchedOrder.Status == Domain.Enums.OrderStatus.New)
                {
                    matchedOrder.Status = Domain.Enums.OrderStatus.Processing;
                    orderRepository.Update(matchedOrder);
                    await unitOfWork.SaveChangesAsync(cancellationToken);

                    // Gửi email xác nhận thanh toán & triển khai dịch vụ
                    try
                    {
                        var planName = matchedOrder.PlanPrice?.Plan?.Name ?? "Gói dịch vụ Cloud";
                        var billingCycle = matchedOrder.PlanPrice?.BillingCycle ?? "Hàng tháng";
                        var amount = matchedOrder.PlanPrice?.Price ?? (decimal)statusDto.Amount;
                        var frontendUrl = configuration["AppSettings:FrontendUrl"] ?? "https://cloudservices.vn";

                        var emailSubject = $"[CloudServices] Xác nhận thanh toán thành công đơn hàng #{orderCode}";
                        var emailHtml = emailTemplateService.GeneratePaymentSuccessEmail(
                            matchedOrder.CustomerName,
                            orderCode.ToString(),
                            planName,
                            billingCycle,
                            amount,
                            matchedOrder.Notes,
                            frontendUrl);

                        await emailSender.SendEmailAsync(matchedOrder.CustomerEmail, emailSubject, emailHtml);
                        logger.LogInformation("Đã gửi email xác nhận thanh toán cho khách hàng {Email}, đơn hàng #{OrderCode}", matchedOrder.CustomerEmail, orderCode);
                    }
                    catch (Exception ex)
                    {
                        logger.LogError(ex, "Lỗi khi gửi email xác nhận thanh toán cho đơn hàng #{OrderCode}", orderCode);
                    }
                }
                // Nếu chưa thanh toán và đã quá 5 phút -> Chuyển sang Rejected (Từ chối)
                else if (!statusDto.IsPaid && matchedOrder.Status == Domain.Enums.OrderStatus.New)
                {
                    var baseTime = matchedOrder.LastModifiedAt ?? matchedOrder.CreatedAt;
                    if (DateTime.UtcNow - baseTime > TimeSpan.FromMinutes(5))
                    {
                        matchedOrder.Status = Domain.Enums.OrderStatus.Rejected;
                        matchedOrder.Notes = $"{matchedOrder.Notes} [Hết hạn thanh toán 5p]";
                        orderRepository.Update(matchedOrder);
                        await unitOfWork.SaveChangesAsync(cancellationToken);
                    }
                }
            }

            return Ok(statusDto);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Không thể lấy trạng thái thanh toán", detail = ex.Message });
        }
    }

    [HttpPost("payos-webhook")]
    [AllowAnonymous]
    public async Task<IActionResult> PayOSWebhook([FromBody] object webhookBody)
    {
        var command = new ProcessPayOSWebhookCommand(webhookBody);
        var success = await Mediator.Send(command);

        if (!success)
            return BadRequest(new { message = "Chữ ký webhook không hợp lệ." });

        return Ok(new { success = true, message = "Xử lý webhook thành công." });
    }
}
