using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using MediatR;

namespace CloudServices.Application.Features.ServicePlans.Queries;

public sealed class GetServicePlanByIdQueryHandler(IServicePlanRepository repository, ICacheService cache)
    : IRequestHandler<GetServicePlanByIdQuery, ServicePlanDto>
{
    public async Task<ServicePlanDto> Handle(GetServicePlanByIdQuery request, CancellationToken cancellationToken)
    {
        return await cache.GetOrCreateAsync(
            $"plans:id_{request.Id}",
            async ct =>
            {
                var plan = await repository.GetByIdAsync(request.Id, ct)
                    ?? throw new NotFoundException("Service plan was not found.");
                return ServicePlanMapper.ToDto(plan);
            },
            TimeSpan.FromMinutes(2),
            cancellationToken);
    }
}
