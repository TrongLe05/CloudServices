using CloudServices.Application.Features.AuditLogs.DTOs;
using MediatR;

namespace CloudServices.Application.Features.AuditLogs.Queries.GetAuditLogById;

public sealed record GetAuditLogByIdQuery(Guid Id) : IRequest<AuditLogDto?>;
