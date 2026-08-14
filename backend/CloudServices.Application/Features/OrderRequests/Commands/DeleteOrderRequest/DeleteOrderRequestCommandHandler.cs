using CloudServices.Application.Common.Interfaces;
using MediatR;

namespace CloudServices.Application.Features.OrderRequests.Commands.DeleteOrderRequest;

public class DeleteOrderRequestCommandHandler : IRequestHandler<DeleteOrderRequestCommand, bool>
{
    private readonly IOrderRequestRepository _repository;

    public DeleteOrderRequestCommandHandler(IOrderRequestRepository repository)
    {
        _repository = repository;
    }

    public async Task<bool> Handle(DeleteOrderRequestCommand request, CancellationToken cancellationToken)
    {
        var orderRequest = await _repository.GetByIdAsync(request.Id, cancellationToken);
        if (orderRequest is null)
        {
            return false;
        }

        await _repository.DeleteAsync(orderRequest, cancellationToken);
        return true;
    }
}
