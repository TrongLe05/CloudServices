using CloudServices.Application.Common.Interfaces;
using CloudServices.Domain.Entities;
using MediatR;

namespace CloudServices.Application.Features.ServiceCategories.Commands.CreateServiceCategory;

public class CreateServiceCategoryCommandHandler : IRequestHandler<CreateServiceCategoryCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateServiceCategoryCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateServiceCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = new ServiceCategory
        {
            Name = request.Name,
            Slug = request.Slug,
            Description = request.Description
        };

        _context.ServiceCategories.Add(category);
        await _context.SaveChangesAsync(cancellationToken);

        return category.Id;
    }
}
