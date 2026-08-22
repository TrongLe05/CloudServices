namespace CloudServices.Application.Common.Interfaces;

public record PaymentLinkDto(string CheckoutUrl, long OrderCode, string QrCode);
public record WebhookVerificationResult(bool IsValid, long OrderCode, string Code);

public interface IPaymentGateway
{
    Task<PaymentLinkDto> CreatePaymentLinkAsync(
        long orderCode,
        int amount,
        string description,
        string planName,
        string returnUrl,
        string cancelUrl,
        CancellationToken cancellationToken = default);

    WebhookVerificationResult VerifyWebhook(object webhookBody);
}