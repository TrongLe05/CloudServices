using MediatR;

namespace CloudServices.Application.Features.Promotions.Commands;

public record DeletePromotionCommand(Guid Id) : IRequest<bool>;