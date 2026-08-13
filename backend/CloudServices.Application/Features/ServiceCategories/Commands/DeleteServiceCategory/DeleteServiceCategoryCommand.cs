using MediatR;

namespace CloudServices.Application.Features.ServiceCategories.Commands.DeleteServiceCategory;

using MediatR;

public record DeleteServiceCategoryCommand(Guid Id) : IRequest<Unit>;
