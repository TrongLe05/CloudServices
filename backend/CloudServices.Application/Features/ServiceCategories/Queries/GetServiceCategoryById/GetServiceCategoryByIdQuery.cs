using CloudServices.Application.Features.ServiceCategories;
using MediatR;

namespace CloudServices.Application.Features.ServiceCategories.Queries.GetServiceCategoryById;

public record GetServiceCategoryByIdQuery(Guid Id) : IRequest<ServiceCategoryDto>;
