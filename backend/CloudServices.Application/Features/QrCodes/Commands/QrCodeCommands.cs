using MediatR;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.QrCodes.DTOs;

namespace CloudServices.Application.Features.QrCodes.Commands;

// 1. PUBLIC: Lấy mã QR
public record GetServicePlanQrCodeQuery(Guid ServicePlanId) : IRequest<QrCodeDto?>;

public class GetServicePlanQrCodeQueryHandler : IRequestHandler<GetServicePlanQrCodeQuery, QrCodeDto?>
{
    private readonly IServicePlanRepository _servicePlanRepository;
    private readonly IQrCodeGenerator _qrCodeGenerator;

    public GetServicePlanQrCodeQueryHandler(IServicePlanRepository servicePlanRepository, IQrCodeGenerator qrCodeGenerator)
    {
        _servicePlanRepository = servicePlanRepository;
        _qrCodeGenerator = qrCodeGenerator;
    }

    public async Task<QrCodeDto?> Handle(GetServicePlanQrCodeQuery request, CancellationToken cancellationToken)
    {
        var plan = await _servicePlanRepository.GetByIdAsync(request.ServicePlanId, cancellationToken);
        if (plan == null) return null;

        var targetUrl = $"https://cloudservices.vn/plans/{plan.Id}";
        var qrBytes = _qrCodeGenerator.GenerateQrCode(targetUrl);

        return new QrCodeDto
        {
            ServicePlanId = plan.Id,
            TargetUrl = targetUrl,
            QrCodeBase64 = $"data:image/png;base64,{Convert.ToBase64String(qrBytes)}"
        };
    }
}

// 2. ADMIN: Tạo lại mã QR
public record RegenerateServicePlanQrCodeCommand(Guid ServicePlanId) : IRequest<QrCodeDto?>;

public class RegenerateServicePlanQrCodeCommandHandler : IRequestHandler<RegenerateServicePlanQrCodeCommand, QrCodeDto?>
{
    private readonly IServicePlanRepository _servicePlanRepository;
    private readonly IQrCodeGenerator _qrCodeGenerator;

    public RegenerateServicePlanQrCodeCommandHandler(IServicePlanRepository servicePlanRepository, IQrCodeGenerator qrCodeGenerator)
    {
        _servicePlanRepository = servicePlanRepository;
        _qrCodeGenerator = qrCodeGenerator;
    }

    public async Task<QrCodeDto?> Handle(RegenerateServicePlanQrCodeCommand request, CancellationToken cancellationToken)
    {
        var plan = await _servicePlanRepository.GetByIdAsync(request.ServicePlanId, cancellationToken);
        if (plan == null) return null;

        var targetUrl = $"https://cloudservices.vn/plans/{plan.Id}?regenerated={DateTime.UtcNow.Ticks}";
        var qrBytes = _qrCodeGenerator.GenerateQrCode(targetUrl);

        return new QrCodeDto
        {
            ServicePlanId = plan.Id,
            TargetUrl = targetUrl,
            QrCodeBase64 = $"data:image/png;base64,{Convert.ToBase64String(qrBytes)}"
        };
    }
}