using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CloudServices.Application.Features.ServiceCategories.Commands.UpdateServiceCategory;

public class UpdateServiceCategoryCommandHandler : IRequestHandler<UpdateServiceCategoryCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateServiceCategoryCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(UpdateServiceCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _context.ServiceCategories
            .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

        if (category == null)
        {
            throw new NotFoundException("ServiceCategory not found.");
        }

        category.Name = request.Name;
        category.Slug = request.Slug;
        category.Description = request.Description;

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
