using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using MediatR;
namespace CloudServices.Application.Features.OrderRequests.Commands.DeleteOrderRequest;
public sealed class DeleteOrderRequestCommandHandler(IOrderRequestRepository repository, IUnitOfWork unitOfWork) : IRequestHandler<DeleteOrderRequestCommand>
{ public async Task Handle(DeleteOrderRequestCommand request, CancellationToken cancellationToken) { var order = await repository.GetByIdAsync(request.Id, cancellationToken) ?? throw new NotFoundException("Order request was not found."); repository.Delete(order); await unitOfWork.SaveChangesAsync(cancellationToken); } }
