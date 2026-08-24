namespace CloudServices.Application.Features.Payments.Commands.CreatePayOSLink;

public record CreatePayOSLinkResponse(
    string CheckoutUrl,
    long OrderCode,
    int Amount,
    string Description,
    string QrCode,
    string? AccountNumber = null,
    string? AccountName = null,
    string? Bin = null,
    string? VietQrUrl = null
);