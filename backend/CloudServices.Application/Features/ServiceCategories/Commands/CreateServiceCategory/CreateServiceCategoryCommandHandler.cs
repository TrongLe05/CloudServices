using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Domain.Entities;
using MediatR;

namespace CloudServices.Application.Features.ServiceCategories.Commands.CreateServiceCategory;

public class CreateServiceCategoryCommandHandler : IRequestHandler<CreateServiceCategoryCommand, Guid>
{
    private readonly IServiceCategoryRepository _repository;

    public CreateServiceCategoryCommandHandler(IServiceCategoryRepository repository)
    {
        _repository = repository;
    }

    public async Task<Guid> Handle(CreateServiceCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = new ServiceCategory
        {
            Name = request.Name,
            Slug = request.Slug,
            Description = request.Description
        };

        await _repository.AddAsync(category, cancellationToken);

        return category.Id;
    }
}
