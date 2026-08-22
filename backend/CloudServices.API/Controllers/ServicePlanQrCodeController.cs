using CloudServices.Application.Features.QrCodes.Commands;
using CloudServices.Application.Features.QrCodes.DTOs;
using CloudServices.Application.Features.QrCodes.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
    [Authorize(Roles = "Admin,Editor")]
    public async Task<ActionResult<QrCodeDto>> RegenerateQrCode(Guid id, [FromBody] RegenerateQrCodeRequest? request = null)
    {
        var result = await Mediator.Send(new RegenerateServicePlanQrCodeCommand(id, request?.CustomDomain));
        if (result == null) return NotFound(new { message = "Service plan not found." });

        return Ok(result);
    }
}

public record RegenerateQrCodeRequest(string? CustomDomain);