using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Exceptions.BadRequestException;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Domain.Enums;
using MediatR;
namespace CloudServices.Application.Features.OrderRequests.Commands.ChangeOrderStatus;
public sealed class ChangeOrderStatusCommandHandler(IOrderRequestRepository repository, IUnitOfWork unitOfWork) : IRequestHandler<ChangeOrderStatusCommand>
{ public async Task Handle(ChangeOrderStatusCommand request, CancellationToken cancellationToken) { if (!Enum.TryParse<OrderStatus>(request.Status, true, out var status)) throw new BadRequestException("Invalid order status."); var order = await repository.GetByIdAsync(request.Id, cancellationToken) ?? throw new NotFoundException("Order request was not found."); order.Status = status; repository.Update(order); await unitOfWork.SaveChangesAsync(cancellationToken); } }
