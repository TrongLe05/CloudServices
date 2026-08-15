using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Domain.Entities;
using FluentValidation;
using MediatR;

namespace CloudServices.Application.Features.ServicePlans.Commands;

public sealed record CreateServicePlanCommand(Guid CategoryId, string Name, string? Description, string? Cpu, string? Ram, string? Storage, string? Bandwidth) : IRequest<Guid>;

public sealed class CreateServicePlanCommandValidator : AbstractValidator<CreateServicePlanCommand>
{
    public CreateServicePlanCommandValidator()
    {
        RuleFor(x => x.CategoryId).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
    }
}

public sealed class CreateServicePlanCommandHandler(IServicePlanRepository repository, IUnitOfWork unitOfWork)
    : IRequestHandler<CreateServicePlanCommand, Guid>
{
    public async Task<Guid> Handle(CreateServicePlanCommand request, CancellationToken cancellationToken)
    {
        var plan = new ServicePlan { CategoryId = request.CategoryId, Name = request.Name.Trim(), Description = request.Description, Cpu = request.Cpu, Ram = request.Ram, Storage = request.Storage, Bandwidth = request.Bandwidth };
        await repository.AddAsync(plan, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return plan.Id;
    }
}
