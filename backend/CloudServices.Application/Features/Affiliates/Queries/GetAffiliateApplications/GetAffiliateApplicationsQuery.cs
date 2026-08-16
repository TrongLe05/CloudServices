using MediatR;

namespace CloudServices.Application.Features.Affiliates.Queries.GetAffiliateApplications;

public sealed record GetAffiliateApplicationsQuery(string? Search, string? Status, int Page = 1, int PageSize = 10) : IRequest<AffiliateApplicationPage>;
