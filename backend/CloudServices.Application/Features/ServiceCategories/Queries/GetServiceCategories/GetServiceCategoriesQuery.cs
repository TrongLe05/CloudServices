using MediatR;

namespace CloudServices.Application.Features.ServiceCategories.Queries.GetServiceCategories;

public record GetServiceCategoriesQuery : IRequest<List<ServiceCategoryDto>>;
