using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.QrCodes.DTOs;
using MediatR;

namespace CloudServices.Application.Features.QrCodes.Queries;

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