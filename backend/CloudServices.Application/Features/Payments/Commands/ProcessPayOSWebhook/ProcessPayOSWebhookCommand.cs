using MediatR;

namespace CloudServices.Application.Features.Payments.Commands.ProcessPayOSWebhook;

public record ProcessPayOSWebhookCommand(object WebhookPayload) : IRequest<bool>;