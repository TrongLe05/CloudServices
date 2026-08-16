using MediatR;

namespace CloudServices.Application.Features.Affiliates.Commands.DeleteAffiliate;

public sealed record DeleteAffiliateCommand(Guid Id) : IRequest;
