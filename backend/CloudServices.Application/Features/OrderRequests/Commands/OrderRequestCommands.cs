using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Exceptions.BadRequestException;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Domain.Entities;
using CloudServices.Domain.Enums;
using FluentValidation;
using MediatR;

namespace CloudServices.Application.Features.OrderRequests.Commands;

public sealed record CreateOrderRequestCommand(Guid ServicePlanId, string BillingCycle, string CustomerName, string Email, string Phone, string? CompanyName) : IRequest<Guid>;
public sealed record ChangeOrderStatusCommand(Guid Id, string Status) : IRequest;
public sealed record DeleteOrderRequestCommand(Guid Id) : IRequest;
public sealed class CreateOrderRequestCommandValidator : AbstractValidator<CreateOrderRequestCommand>
{
    public CreateOrderRequestCommandValidator() { RuleFor(x => x.ServicePlanId).NotEmpty(); RuleFor(x => x.BillingCycle).NotEmpty().MaximumLength(50); RuleFor(x => x.CustomerName).NotEmpty().MaximumLength(100); RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(100); RuleFor(x => x.Phone).NotEmpty().MaximumLength(20); RuleFor(x => x.CompanyName).MaximumLength(150); }
}
public sealed class CreateOrderRequestCommandHandler(IPlanPriceRepository prices, IOrderRequestRepository orders, IUnitOfWork unitOfWork) : IRequestHandler<CreateOrderRequestCommand, Guid>
{
    public async Task<Guid> Handle(CreateOrderRequestCommand r, CancellationToken ct)
    {
        var price = (await prices.GetByPlanIdAsync(r.ServicePlanId, ct)).FirstOrDefault(x => string.Equals(x.BillingCycle, r.BillingCycle, StringComparison.OrdinalIgnoreCase)) ?? throw new NotFoundException("The requested service plan and billing cycle were not found.");
        var order = new OrderRequest { PlanPriceId = price.Id, CustomerName = r.CustomerName.Trim(), CustomerEmail = r.Email.Trim(), CustomerPhone = r.Phone.Trim(), CompanyName = r.CompanyName?.Trim() };
        await orders.AddAsync(order, ct); await unitOfWork.SaveChangesAsync(ct); return order.Id;
    }
}
public sealed class ChangeOrderStatusCommandHandler(IOrderRequestRepository repository, IUnitOfWork unitOfWork) : IRequestHandler<ChangeOrderStatusCommand>
{
    public async Task Handle(ChangeOrderStatusCommand r, CancellationToken ct) { if (!Enum.TryParse<OrderStatus>(r.Status, true, out var status)) throw new BadRequestException("Invalid order status."); var order = await repository.GetByIdAsync(r.Id, ct) ?? throw new NotFoundException("Order request was not found."); order.Status = status; repository.Update(order); await unitOfWork.SaveChangesAsync(ct); }
}
public sealed class DeleteOrderRequestCommandHandler(IOrderRequestRepository repository, IUnitOfWork unitOfWork) : IRequestHandler<DeleteOrderRequestCommand>
{
    public async Task Handle(DeleteOrderRequestCommand r, CancellationToken ct) { var order = await repository.GetByIdAsync(r.Id, ct) ?? throw new NotFoundException("Order request was not found."); repository.Delete(order); await unitOfWork.SaveChangesAsync(ct); }
}
