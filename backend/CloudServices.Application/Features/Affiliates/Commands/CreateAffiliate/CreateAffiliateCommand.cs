using MediatR;

namespace CloudServices.Application.Features.Affiliates.Commands.CreateAffiliate;

public sealed record CreateAffiliateCommand(string FullName, string Email, string Phone, string WebsiteUrl, string Motivation) : IRequest<Guid>;
