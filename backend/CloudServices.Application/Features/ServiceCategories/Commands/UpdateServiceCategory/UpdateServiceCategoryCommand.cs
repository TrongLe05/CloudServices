using MediatR;

namespace CloudServices.Application.Features.ServiceCategories.Commands.UpdateServiceCategory;

using MediatR;

public record UpdateServiceCategoryCommand(Guid Id, string Name, string Slug, string? Description) : IRequest<Unit>;
