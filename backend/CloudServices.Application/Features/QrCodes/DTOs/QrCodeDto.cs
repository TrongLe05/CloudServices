namespace CloudServices.Application.Features.QrCodes.DTOs;

public class QrCodeDto
{
    public Guid ServicePlanId { get; set; }
    public string TargetUrl { get; set; } = string.Empty;
    public string QrCodeBase64 { get; set; } = string.Empty;
}