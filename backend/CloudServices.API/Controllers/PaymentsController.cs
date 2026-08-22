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
        CancellationToken cancellationToken)
    {
        try
        {
            var statusDto = await paymentGateway.GetPaymentStatusAsync(orderCode, cancellationToken);
            
            // Nếu đã thanh toán thành công, tự động đồng bộ đơn hàng sang Completed
            if (statusDto.IsPaid)
            {
                var allOrders = await orderRepository.GetAllAsync(cancellationToken);
                var matchedOrder = allOrders.FirstOrDefault(o => o.Notes == $"PayOS:{orderCode}");
                if (matchedOrder != null && matchedOrder.Status != Domain.Enums.OrderStatus.Completed)
                {
                    matchedOrder.Status = Domain.Enums.OrderStatus.Completed;
                    orderRepository.Update(matchedOrder);
                    await unitOfWork.SaveChangesAsync(cancellationToken);
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
