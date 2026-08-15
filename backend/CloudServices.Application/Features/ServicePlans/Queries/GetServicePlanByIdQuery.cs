using MediatR;

namespace CloudServices.Application.Features.ServicePlans.Queries;

public sealed record GetServicePlanByIdQuery(Guid Id) : IRequest<ServicePlanDto>;

