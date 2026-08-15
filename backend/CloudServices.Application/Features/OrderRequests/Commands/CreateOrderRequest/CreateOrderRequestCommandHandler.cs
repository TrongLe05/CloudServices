using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Domain.Entities;
using MediatR;
namespace CloudServices.Application.Features.OrderRequests.Commands.CreateOrderRequest;
public sealed class CreateOrderRequestCommandHandler(IPlanPriceRepository prices, IOrderRequestRepository orders, IUnitOfWork unitOfWork) : IRequestHandler<CreateOrderRequestCommand, Guid>
{ public async Task<Guid> Handle(CreateOrderRequestCommand request, CancellationToken cancellationToken) { var price = (await prices.GetByPlanIdAsync(request.ServicePlanId, cancellationToken)).FirstOrDefault(x => string.Equals(x.BillingCycle, request.BillingCycle, StringComparison.OrdinalIgnoreCase)) ?? throw new NotFoundException("The requested service plan and billing cycle were not found."); var order = new OrderRequest { PlanPriceId = price.Id, CustomerName = request.CustomerName.Trim(), CustomerEmail = request.Email.Trim(), CustomerPhone = request.Phone.Trim(), CompanyName = request.CompanyName?.Trim() }; await orders.AddAsync(order, cancellationToken); await unitOfWork.SaveChangesAsync(cancellationToken); return order.Id; } }
