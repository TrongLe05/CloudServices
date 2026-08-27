using CloudServices.Application.Common.Helpers;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.QrCodes.DTOs;
using MediatR;
using Microsoft.Extensions.Configuration;

namespace CloudServices.Application.Features.QrCodes.Queries;

public class GetServicePlanQrCodeQueryHandler : IRequestHandler<GetServicePlanQrCodeQuery, QrCodeDto?>
{
	private readonly IServicePlanRepository _servicePlanRepository;
	private readonly IQrCodeGenerator _qrCodeGenerator;
	private readonly IConfiguration _configuration;

	public GetServicePlanQrCodeQueryHandler(
		IServicePlanRepository servicePlanRepository, 
		IQrCodeGenerator qrCodeGenerator,
		IConfiguration configuration)
	{
		_servicePlanRepository = servicePlanRepository;
		_qrCodeGenerator = qrCodeGenerator;
		_configuration = configuration;
	}

	public async Task<QrCodeDto?> Handle(GetServicePlanQrCodeQuery request, CancellationToken cancellationToken)
	{
		var plan = await _servicePlanRepository.GetByIdAsync(request.ServicePlanId, cancellationToken);
		if (plan == null) return null;

		var baseDomain = _configuration["AppSettings:Domain"]?.TrimEnd('/') 
			?? _configuration["AppSettings:FrontendUrl"]?.TrimEnd('/') 
			?? "https://cloudservices.vn";

		var categorySlug = plan.Category != null 
			? (!string.IsNullOrWhiteSpace(plan.Category.Slug) ? plan.Category.Slug : SlugHelper.GenerateSlug(plan.Category.Name))
			: "dich-vu";

		var planSlug = SlugHelper.GenerateSlug(plan.Name);

		// URL thân thiện theo slug: {baseDomain}/dich-vu/{categorySlug}/{planSlug}
		var targetUrl = $"{baseDomain}/dich-vu/{categorySlug}/{planSlug}";
		var qrBytes = _qrCodeGenerator.GenerateQrCode(targetUrl);

		return new QrCodeDto
		{
			ServicePlanId = plan.Id,
			TargetUrl = targetUrl,
			QrCodeBase64 = $"data:image/png;base64,{Convert.ToBase64String(qrBytes)}"
		};
	}
}