using CloudServices.Application.Features.AuditLogs.Queries.GetAuditLogById;
using CloudServices.Application.Features.AuditLogs.Queries.GetAuditLogs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CloudServices.API.Controllers;

[Route("api/audit-logs")]
[Authorize(Roles = "Admin")]
public sealed class AuditLogsController : ApiControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get(
        [FromQuery] string? category,
        [FromQuery] string? search,
        [FromQuery] string? action,
        [FromQuery] string? httpMethod,
        [FromQuery] int? statusCode,
        [FromQuery] bool? isSuccess,
        [FromQuery] string? username,
        [FromQuery] DateTime? fromDate,
        [FromQuery] DateTime? toDate,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var query = new GetAuditLogsQuery(
            category,
            search,
            action,
            httpMethod,
            statusCode,
            isSuccess,
            username,
            fromDate,
            toDate,
            page,
            pageSize);

        var result = await Mediator.Send(query, cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await Mediator.Send(new GetAuditLogByIdQuery(id), cancellationToken);
        if (result is null)
        {
            return NotFound(new { message = "Không tìm thấy bản ghi nhật ký hệ thống." });
        }

        return Ok(result);
    }
}
