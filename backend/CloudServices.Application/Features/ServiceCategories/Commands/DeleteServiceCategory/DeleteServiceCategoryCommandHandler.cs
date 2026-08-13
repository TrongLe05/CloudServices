using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Interfaces.Repositories;
using MediatR;

namespace CloudServices.Application.Features.ServiceCategories.Commands.DeleteServiceCategory;

public class DeleteServiceCategoryCommandHandler : IRequestHandler<DeleteServiceCategoryCommand>
{
    private readonly IServiceCategoryRepository _repository;

    public DeleteServiceCategoryCommandHandler(IServiceCategoryRepository repository)
    {
        _repository = repository;
    }

    public async Task<Unit> Handle(DeleteServiceCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _repository.GetByIdAsync(request.Id, cancellationToken);

        if (category == null)
        {
            throw new NotFoundException("ServiceCategory not found.");
        }

        await _repository.DeleteAsync(request.Id, cancellationToken);

        return Unit.Value;
    }
}
