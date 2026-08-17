using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Interfaces.Repositories;
using MapsterMapper;
using MediatR;

namespace CloudServices.Application.Features.Affiliates.Queries.GetAffiliateApplicationById;

public sealed class GetAffiliateApplicationByIdQueryHandler(
    IAffiliateApplicationRepository repository, 
    IMapper mapper) : IRequestHandler<GetAffiliateApplicationByIdQuery, AffiliateApplicationDto>
{
    public async Task<AffiliateApplicationDto> Handle(GetAffiliateApplicationByIdQuery request, CancellationToken cancellationToken)
    {
        var application = await repository.GetByIdAsync(request.Id, cancellationToken)
                ?? throw new NotFoundException("Not found");

        return mapper.Map<AffiliateApplicationDto>(application);
    }
}
