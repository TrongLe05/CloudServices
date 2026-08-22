namespace CloudServices.Application.Features.Payments.Commands.CreatePayOSLink;

public record CreatePayOSLinkResponse(
    string CheckoutUrl,
    long OrderCode,
    string QrCode
);