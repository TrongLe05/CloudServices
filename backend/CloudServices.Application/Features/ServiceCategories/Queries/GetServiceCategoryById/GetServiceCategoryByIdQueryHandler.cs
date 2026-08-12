using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Features.ServiceCategories;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CloudServices.Application.Features.ServiceCategories.Queries.GetServiceCategoryById;

public class GetServiceCategoryByIdQueryHandler : IRequestHandler<GetServiceCategoryByIdQuery, ServiceCategoryDto>
{
    private readonly IApplicationDbContext _context;

    public GetServiceCategoryByIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ServiceCategoryDto> Handle(GetServiceCategoryByIdQuery request, CancellationToken cancellationToken)
    {
        var category = await _context.ServiceCategories
            .Where(c => c.Id == request.Id)
            .ProjectToType<ServiceCategoryDto>()
            .FirstOrDefaultAsync(cancellationToken);

        return category ?? throw new NotFoundException("ServiceCategory not found.");
    }
}
