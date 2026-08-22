using CloudServices.Application.Common.Interfaces;
using Net.payOS;
using Net.payOS.Types;
using System.Text.Json;

namespace CloudServices.Infrastructure.Services;

public class PayOSPaymentGateway : IPaymentGateway
{
    private readonly PayOS _payOS;

    public PayOSPaymentGateway(PayOS payOS)
    {
        _payOS = payOS;
    }

    public async Task<PaymentLinkDto> CreatePaymentLinkAsync(
        long orderCode,
        int amount,
        string description,
        string planName,
        string returnUrl,
        string cancelUrl,
        CancellationToken cancellationToken = default)
    {
        var item = new ItemData(planName, 1, amount);
        var paymentData = new PaymentData(
            orderCode: orderCode,
            amount: amount,
            description: description,
            items: new List<ItemData> { item },
            cancelUrl: cancelUrl,
            returnUrl: returnUrl
        );

        CreatePaymentResult result = await _payOS.createPaymentLink(paymentData);

        return new PaymentLinkDto(
            CheckoutUrl: result.checkoutUrl,
            OrderCode: orderCode,
            QrCode: result.qrCode,
            AccountNumber: result.accountNumber,
            AccountName: result.accountNumber != null ? "CONG TY CLOUD SERVICES" : null,
            Bin: result.bin
        );
    }

    public async Task<PaymentStatusDto> GetPaymentStatusAsync(long orderCode, CancellationToken cancellationToken = default)
    {
        PaymentLinkInformation info = await _payOS.getPaymentLinkInformation(orderCode);
        bool isPaid = string.Equals(info.status, "PAID", StringComparison.OrdinalIgnoreCase);

        return new PaymentStatusDto(
            OrderCode: info.orderCode,
            Amount: info.amount,
            AmountPaid: info.amountPaid,
            Status: info.status,
            IsPaid: isPaid
        );
    }

    public WebhookVerificationResult VerifyWebhook(object webhookBody)
    {
        try
        {
            var json = JsonSerializer.Serialize(webhookBody);
            var webhookType = JsonSerializer.Deserialize<WebhookType>(json);
            if (webhookType == null) return new WebhookVerificationResult(false, 0, string.Empty);

            WebhookData data = _payOS.verifyPaymentWebhookData(webhookType);
            return new WebhookVerificationResult(true, data.orderCode, webhookType.code);
        }
        catch
        {
            return new WebhookVerificationResult(false, 0, string.Empty);
        }
    }
}