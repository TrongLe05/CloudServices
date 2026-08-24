using MediatR;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.Testimonials.DTOs;

namespace CloudServices.Application.Features.Testimonials.Queries;

// GET ALL
public record GetAllTestimonialsQuery() : IRequest<List<TestimonialDto>>;

public class GetAllTestimonialsQueryHandler : IRequestHandler<GetAllTestimonialsQuery, List<TestimonialDto>>
{
    private readonly ITestimonialRepository _repository;
    private readonly ICacheService _cache;

    public GetAllTestimonialsQueryHandler(ITestimonialRepository repository, ICacheService cache)
    {
        _repository = repository;
        _cache = cache;
    }

    public async Task<List<TestimonialDto>> Handle(GetAllTestimonialsQuery request, CancellationToken cancellationToken)
    {
        return await _cache.GetOrCreateAsync(
            "testimonials:all",
            async ct =>
            {
                var list = await _repository.GetAllAsync(ct);
                return list.Select(x => new TestimonialDto
                {
                    Id = x.Id,
                    ClientName = x.ClientName,
                    Company = x.Company,
                    Position = x.Position,
                    Content = x.Content,
                    AvatarUrl = x.AvatarUrl,
                    CompanyLogoUrl = x.CompanyLogoUrl,
                    Rating = x.Rating,
                    IsActive = x.IsActive,
                    DisplayOrder = x.DisplayOrder,
                    CreatedAt = x.CreatedAt
                }).ToList();
            },
            TimeSpan.FromMinutes(5),
            cancellationToken);
    }
}

// GET BY ID
public record GetTestimonialByIdQuery(Guid Id) : IRequest<TestimonialDto?>;

public class GetTestimonialByIdQueryHandler : IRequestHandler<GetTestimonialByIdQuery, TestimonialDto?>
{
    private readonly ITestimonialRepository _repository;
    private readonly ICacheService _cache;

    public GetTestimonialByIdQueryHandler(ITestimonialRepository repository, ICacheService cache)
    {
        _repository = repository;
        _cache = cache;
    }

    public async Task<TestimonialDto?> Handle(GetTestimonialByIdQuery request, CancellationToken cancellationToken)
    {
        return await _cache.GetOrCreateAsync(
            $"testimonials:id_{request.Id}",
            async ct =>
            {
                var item = await _repository.GetByIdAsync(request.Id, ct);
                if (item == null) return null;

                return new TestimonialDto
                {
                    Id = item.Id,
                    ClientName = item.ClientName,
                    Company = item.Company,
                    Position = item.Position,
                    Content = item.Content,
                    AvatarUrl = item.AvatarUrl,
                    CompanyLogoUrl = item.CompanyLogoUrl,
                    Rating = item.Rating,
                    IsActive = item.IsActive,
                    DisplayOrder = item.DisplayOrder,
                    CreatedAt = item.CreatedAt
                };
            },
            TimeSpan.FromMinutes(5),
            cancellationToken);
    }
}