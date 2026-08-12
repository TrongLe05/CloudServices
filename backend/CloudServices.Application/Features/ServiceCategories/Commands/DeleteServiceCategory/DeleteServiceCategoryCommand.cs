using MediatR;

namespace CloudServices.Application.Features.ServiceCategories.Commands.DeleteServiceCategory;

public record DeleteServiceCategoryCommand(Guid Id) : IRequest;
