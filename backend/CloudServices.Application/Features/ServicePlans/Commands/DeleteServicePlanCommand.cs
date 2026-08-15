using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using MediatR;

namespace CloudServices.Application.Features.ServicePlans.Commands;

public sealed record DeleteServicePlanCommand(Guid Id) : IRequest;

public sealed class DeleteServicePlanCommandHandler(IServicePlanRepository repository, IUnitOfWork unitOfWork) : IRequestHandler<DeleteServicePlanCommand>
{
    public async Task Handle(DeleteServicePlanCommand request, CancellationToken cancellationToken)
    {
        var plan = await repository.GetByIdAsync(request.Id, cancellationToken) ?? throw new NotFoundException("Service plan was not found.");
        repository.Delete(plan);
        await unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
