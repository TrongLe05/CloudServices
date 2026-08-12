using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CloudServices.Application.Features.ServiceCategories.Commands.DeleteServiceCategory;

public class DeleteServiceCategoryCommandHandler : IRequestHandler<DeleteServiceCategoryCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteServiceCategoryCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(DeleteServiceCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _context.ServiceCategories
            .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

        if (category == null)
        {
            throw new NotFoundException("ServiceCategory not found.");
        }

        _context.ServiceCategories.Remove(category);
        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
