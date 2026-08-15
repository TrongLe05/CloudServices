using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.OrderRequests.Queries.GetOrderRequests;
using MediatR;
namespace CloudServices.Application.Features.OrderRequests.Queries.GetOrderRequestById;
public sealed class GetOrderRequestByIdQueryHandler(IOrderRequestRepository repository) : IRequestHandler<GetOrderRequestByIdQuery, OrderRequestDto>
{ public async Task<OrderRequestDto> Handle(GetOrderRequestByIdQuery request, CancellationToken cancellationToken) => OrderRequestMapper.ToDto(await repository.GetByIdAsync(request.Id, cancellationToken) ?? throw new NotFoundException("Order request was not found.")); }
