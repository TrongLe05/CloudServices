using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.ServiceCategories;
using Mapster;
using MediatR;

namespace CloudServices.Application.Features.ServiceCategories.Queries.GetServiceCategories;

public class GetServiceCategoriesQueryHandler : IRequestHandler<GetServiceCategoriesQuery, List<ServiceCategoryDto>>
{
    private readonly IServiceCategoryRepository _repository;

    public GetServiceCategoriesQueryHandler(IServiceCategoryRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<ServiceCategoryDto>> Handle(GetServiceCategoriesQuery request, CancellationToken cancellationToken)
    {
        var categories = await _repository.GetAllAsync(cancellationToken);
        return categories.Adapt<List<ServiceCategoryDto>>();
    }
}
