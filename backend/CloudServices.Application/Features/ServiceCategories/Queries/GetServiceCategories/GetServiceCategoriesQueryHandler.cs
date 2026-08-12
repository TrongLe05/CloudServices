using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Features.ServiceCategories;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CloudServices.Application.Features.ServiceCategories.Queries.GetServiceCategories;

public class GetServiceCategoriesQueryHandler : IRequestHandler<GetServiceCategoriesQuery, List<ServiceCategoryDto>>
{
    private readonly IApplicationDbContext _context;

    public GetServiceCategoriesQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<ServiceCategoryDto>> Handle(GetServiceCategoriesQuery request, CancellationToken cancellationToken)
    {
        return await _context.ServiceCategories
            .ProjectToType<ServiceCategoryDto>()
            .ToListAsync(cancellationToken);
    }
}
