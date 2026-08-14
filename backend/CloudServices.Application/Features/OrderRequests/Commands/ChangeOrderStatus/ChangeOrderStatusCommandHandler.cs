using CloudServices.Application.Common.Interfaces;
using CloudServices.Domain.Enums;
using MediatR;

namespace CloudServices.Application.Features.OrderRequests.Commands.ChangeOrderStatus;

public class ChangeOrderStatusCommandHandler : IRequestHandler<ChangeOrderStatusCommand, bool>
{
    private readonly IOrderRequestRepository _repository;

    public ChangeOrderStatusCommandHandler(IOrderRequestRepository repository)
    {
        _repository = repository;
    }

    public async Task<bool> Handle(ChangeOrderStatusCommand request, CancellationToken cancellationToken)
    {
        if (!Enum.TryParse<OrderStatus>(request.Status, true, out var status))
        {
            throw new ArgumentException("Trạng thái không hợp lệ.");
        }

        var orderRequest = await _repository.GetByIdAsync(request.Id, cancellationToken);
        if (orderRequest is null)
        {
            return false;
        }

        orderRequest.Status = status;
        await _repository.UpdateAsync(orderRequest, cancellationToken);
        return true;
    }
}
