using MediatR;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.Testimonials.DTOs;

namespace CloudServices.Application.Features.Testimonials.Queries;

// GET ALL
public record GetAllTestimonialsQuery() : IRequest<List<TestimonialDto>>;

public class GetAllTestimonialsQueryHandler : IRequestHandler<GetAllTestimonialsQuery, List<TestimonialDto>>
{
    private readonly ITestimonialRepository _repository;

    public GetAllTestimonialsQueryHandler(ITestimonialRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<TestimonialDto>> Handle(GetAllTestimonialsQuery request, CancellationToken cancellationToken)
    {
        var list = await _repository.GetAllAsync(cancellationToken);
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
    }
}

// GET BY ID
public record GetTestimonialByIdQuery(Guid Id) : IRequest<TestimonialDto?>;

public class GetTestimonialByIdQueryHandler : IRequestHandler<GetTestimonialByIdQuery, TestimonialDto?>
{
    private readonly ITestimonialRepository _repository;

    public GetTestimonialByIdQueryHandler(ITestimonialRepository repository)
    {
        _repository = repository;
    }

    public async Task<TestimonialDto?> Handle(GetTestimonialByIdQuery request, CancellationToken cancellationToken)
    {
        var item = await _repository.GetByIdAsync(request.Id, cancellationToken);
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
    }
}