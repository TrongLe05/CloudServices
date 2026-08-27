using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Domain.Entities;
using MediatR;

namespace CloudServices.Application.Features.ServicePlans.Commands;

public sealed class CreateServicePlanCommandHandler(IServicePlanRepository repository, IUnitOfWork unitOfWork, ICacheService cache)
    : IRequestHandler<CreateServicePlanCommand, Guid>
{
    public async Task<Guid> Handle(CreateServicePlanCommand request, CancellationToken cancellationToken)
    {
        var plan = new ServicePlan
        {
            CategoryId = request.CategoryId,
            Name = request.Name.Trim(),
            Description = request.Description,
            Cpu = request.Cpu,
            Ram = request.Ram,
            Storage = request.Storage,
            Bandwidth = request.Bandwidth
        };

        await repository.AddAsync(plan, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        cache.RemoveByPrefix("plans");
        cache.RemoveByPrefix("statistics");

        return plan.Id;
    }
}
