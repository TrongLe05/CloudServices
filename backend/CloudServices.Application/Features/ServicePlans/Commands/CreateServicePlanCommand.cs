using MediatR;

namespace CloudServices.Application.Features.ServicePlans.Commands;

public sealed record CreateServicePlanCommand(Guid CategoryId, string Name, string? Description, string? Cpu, string? Ram, string? Storage, string? Bandwidth) : IRequest<Guid>;

