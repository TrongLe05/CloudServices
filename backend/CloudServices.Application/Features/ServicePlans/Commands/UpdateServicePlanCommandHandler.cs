using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using MediatR;

namespace CloudServices.Application.Features.ServicePlans.Commands;

public sealed class UpdateServicePlanCommandHandler(IServicePlanRepository repository, IUnitOfWork unitOfWork, ICacheService cache)
    : IRequestHandler<UpdateServicePlanCommand>
{
    public async Task Handle(UpdateServicePlanCommand request, CancellationToken cancellationToken)
    {
        var plan = await repository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException("Service plan was not found.");

        plan.CategoryId = request.CategoryId;
        plan.Name = request.Name.Trim();
        plan.Description = request.Description;
        plan.Cpu = request.Cpu;
        plan.Ram = request.Ram;
        plan.Storage = request.Storage;
        plan.Bandwidth = request.Bandwidth;

        repository.Update(plan);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        cache.RemoveByPrefix("plans");
        cache.RemoveByPrefix("statistics");
    }
}
