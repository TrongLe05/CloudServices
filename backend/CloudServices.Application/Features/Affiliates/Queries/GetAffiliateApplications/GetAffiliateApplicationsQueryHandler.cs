using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Domain.Enums;
using MapsterMapper;
using MediatR;

namespace CloudServices.Application.Features.Affiliates.Queries.GetAffiliateApplications;

public sealed class GetAffiliateApplicationsQueryHandler(
    IAffiliateApplicationRepository repository,
    IMapper mapper)
    : IRequestHandler<GetAffiliateApplicationsQuery, AffiliateApplicationPage>
{
    public async Task<AffiliateApplicationPage> Handle(GetAffiliateApplicationsQuery request, CancellationToken cancellationToken)
    {
        AffiliateStatus? status = null;
        if (!string.IsNullOrWhiteSpace(request.Status))
        {
            if(!Enum.TryParse(request.Status, out AffiliateStatus parsedStatus))
                throw new ArgumentException("Invalid affiliate status");

            status = parsedStatus;
        }

        var (items, total) = await repository.GetPagedAsync(
                request.Search,
                status,
                null,
                request.Page,
                request.PageSize,
                cancellationToken);

        var dtos = mapper.Map<IReadOnlyList<AffiliateApplicationDto>>(items);

        return new AffiliateApplicationPage(dtos, request.Page, request.PageSize, total);
    }
}
