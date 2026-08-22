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
