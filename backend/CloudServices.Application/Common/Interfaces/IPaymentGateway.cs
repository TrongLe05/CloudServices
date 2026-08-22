namespace CloudServices.Application.Common.Interfaces;

public record PaymentLinkDto(
    string CheckoutUrl,
    long OrderCode,
    string QrCode,
    string? AccountNumber = null,
    string? AccountName = null,
    string? Bin = null
);

public record PaymentStatusDto(
    long OrderCode,
    int Amount,
    int AmountPaid,
    string Status,
    bool IsPaid
);

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

    Task<PaymentStatusDto> GetPaymentStatusAsync(long orderCode, CancellationToken cancellationToken = default);

    WebhookVerificationResult VerifyWebhook(object webhookBody);
}