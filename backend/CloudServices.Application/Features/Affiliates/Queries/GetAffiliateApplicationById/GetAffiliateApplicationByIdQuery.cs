using MediatR;

namespace CloudServices.Application.Features.Affiliates.Queries.GetAffiliateApplicationById;

public sealed record GetAffiliateApplicationByIdQuery(Guid Id) : IRequest<AffiliateApplicationDto>;
