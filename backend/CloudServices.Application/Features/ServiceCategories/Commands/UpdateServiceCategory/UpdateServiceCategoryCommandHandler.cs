using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Interfaces.Repositories;
using MediatR;

namespace CloudServices.Application.Features.ServiceCategories.Commands.UpdateServiceCategory;

public class UpdateServiceCategoryCommandHandler : IRequestHandler<UpdateServiceCategoryCommand, Unit>
{
    private readonly IServiceCategoryRepository _repository;

    public UpdateServiceCategoryCommandHandler(IServiceCategoryRepository repository)
    {
        _repository = repository;
    }

    public async Task<Unit> Handle(UpdateServiceCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _repository.GetByIdAsync(request.Id, cancellationToken);

        if (category == null)
        {
            throw new NotFoundException("ServiceCategory not found.");
        }

        category.Name = request.Name;
        category.Slug = request.Slug;
        category.Description = request.Description;

        await _repository.UpdateAsync(category, cancellationToken);

        return Unit.Value;
    }
}
