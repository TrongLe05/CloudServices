using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CloudServices.Application.Features.QrCodes.Commands;
using CloudServices.Application.Features.QrCodes.DTOs;

namespace CloudServices.API.Controllers;

[ApiController]
[Route("api/service-plans")]
public class ServicePlanQrCodeController : ApiControllerBase
{
    // 1. PUBLIC: GET /api/service-plans/{id}/qr-code
    [HttpGet("{id:guid}/qr-code")]
    [AllowAnonymous]
    public async Task<ActionResult<QrCodeDto>> GetQrCode(Guid id)
    {
        var result = await Mediator.Send(new GetServicePlanQrCodeQuery(id));
        if (result == null) return NotFound(new { message = "Service plan not found." });

        return Ok(result);
    }

    // 2. ADMIN: POST /api/service-plans/{id}/qr-code/regenerate
    [HttpPost("{id:guid}/qr-code/regenerate")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<QrCodeDto>> RegenerateQrCode(Guid id)
    {
        var result = await Mediator.Send(new RegenerateServicePlanQrCodeCommand(id));
        if (result == null) return NotFound(new { message = "Service plan not found." });

        return Ok(result);
    }
}