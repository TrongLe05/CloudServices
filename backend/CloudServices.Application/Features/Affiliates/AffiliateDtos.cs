using CloudServices.Domain.Enums;

namespace CloudServices.Application.Features.Affiliates;

public sealed record AffiliateApplicationDto(Guid Id, string FullName, string Email, string Phone, string WebsiteUrl, string Motivation, AffiliateStatus Status, DateTime CreatedAt);
public sealed record AffiliateApplicationPage(IReadOnlyList<AffiliateApplicationDto> Items, int Page, int PageSize, int TotalCount);
