using CloudServices.Application.Features.QrCodes.DTOs;
using MediatR;

namespace CloudServices.Application.Features.QrCodes.Queries;

public record GetServicePlanQrCodeQuery(Guid ServicePlanId) : IRequest<QrCodeDto?>;