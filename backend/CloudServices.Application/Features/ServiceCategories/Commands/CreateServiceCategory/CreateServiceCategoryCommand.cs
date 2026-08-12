using MediatR;

namespace CloudServices.Application.Features.ServiceCategories.Commands.CreateServiceCategory;

public record CreateServiceCategoryCommand(string Name, string Slug, string? Description) : IRequest<Guid>;
