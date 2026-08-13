using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.ServiceCategories;
using Mapster;
using MediatR;

namespace CloudServices.Application.Features.ServiceCategories.Queries.GetServiceCategoryById;

public class GetServiceCategoryByIdQueryHandler : IRequestHandler<GetServiceCategoryByIdQuery, ServiceCategoryDto>
{
    private readonly IServiceCategoryRepository _repository;

    public GetServiceCategoryByIdQueryHandler(IServiceCategoryRepository repository)
    {
        _repository = repository;
    }

    public async Task<ServiceCategoryDto> Handle(GetServiceCategoryByIdQuery request, CancellationToken cancellationToken)
    {
        var category = await _repository.GetByIdAsync(request.Id, cancellationToken);

        return category != null ? category.Adapt<ServiceCategoryDto>() : throw new NotFoundException("ServiceCategory not found.");
    }
}
