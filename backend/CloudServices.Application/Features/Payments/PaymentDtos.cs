namespace CloudServices.Application.Features.Payments;

public record CreatePaymentLinkRequest(
    Guid OrderId,
    string ReturnUrl,
    string CancelUrl
);

public record CreatePaymentLinkResponse(
    string CheckoutUrl,
    long OrderCode,
    string QrCode
);