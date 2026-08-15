using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Interfaces.Repositories;
using MediatR;
namespace CloudServices.Application.Features.ServicePlans.Queries;
public sealed class GetServicePlanByIdQueryHandler(IServicePlanRepository repository) : IRequestHandler<GetServicePlanByIdQuery, ServicePlanDto>
{ public async Task<ServicePlanDto> Handle(GetServicePlanByIdQuery request, CancellationToken cancellationToken) => ServicePlanMapper.ToDto(await repository.GetByIdAsync(request.Id, cancellationToken) ?? throw new NotFoundException("Service plan was not found.")); }
