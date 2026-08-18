using MediatR;

namespace CloudServices.Application.Features.Affiliates.Commands.ChangeAffiliateStatus;

public sealed record ChangeAffiliateStatusCommand(Guid Id, string Status) : IRequest;
