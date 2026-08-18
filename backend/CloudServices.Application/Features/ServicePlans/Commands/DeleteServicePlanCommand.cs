using MediatR;

namespace CloudServices.Application.Features.ServicePlans.Commands;

public sealed record DeleteServicePlanCommand(Guid Id) : IRequest;

