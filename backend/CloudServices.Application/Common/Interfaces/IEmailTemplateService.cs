namespace CloudServices.Application.Common.Interfaces;

public interface IEmailTemplateService
{
    string GenerateOtpEmail(string otpCode);
    string GeneratePaymentSuccessEmail(
        string customerName,
        string orderCode,
        string planName,
        string billingCycle,
        decimal amount,
        string? notes = null,
        string? frontendUrl = null);
}
