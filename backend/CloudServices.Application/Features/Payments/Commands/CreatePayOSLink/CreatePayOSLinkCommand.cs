using MediatR;

namespace CloudServices.Application.Features.Payments.Commands.CreatePayOSLink;

public record CreatePayOSLinkCommand(
    Guid OrderId,
    string ReturnUrl,
    string CancelUrl
) : IRequest<CreatePayOSLinkResponse>;

