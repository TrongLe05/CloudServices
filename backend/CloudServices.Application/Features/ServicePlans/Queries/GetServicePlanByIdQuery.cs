using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Interfaces.Repositories;
using MediatR;

namespace CloudServices.Application.Features.ServicePlans.Queries;

public sealed record GetServicePlanByIdQuery(Guid Id) : IRequest<ServicePlanDto>;

public sealed class GetServicePlanByIdQueryHandler(IServicePlanRepository repository)
    : IRequestHandler<GetServicePlanByIdQuery, ServicePlanDto>
{
    public async Task<ServicePlanDto> Handle(GetServicePlanByIdQuery request, CancellationToken cancellationToken)
    {
        var plan = await repository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException("Service plan was not found.");
        return GetServicePlansQueryHandler.Map(plan);
    }
}
