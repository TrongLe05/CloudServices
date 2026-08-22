using CloudServices.Application.Features.QrCodes.DTOs;
using MediatR;

namespace CloudServices.Application.Features.QrCodes.Commands;

public record RegenerateServicePlanQrCodeCommand(Guid ServicePlanId, string? CustomDomain = null) : IRequest<QrCodeDto?>;