using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.Testimonials.DTOs;
using CloudServices.Domain.Entities;
using MediatR;

namespace CloudServices.Application.Features.Testimonials.Commands;

public class CreateTestimonialCommandHandler : IRequestHandler<CreateTestimonialCommand, TestimonialDto>
{
    private readonly ITestimonialRepository _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICacheService _cache;

    public CreateTestimonialCommandHandler(ITestimonialRepository repository, IUnitOfWork unitOfWork, ICacheService cache)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _cache = cache;
    }

    public async Task<TestimonialDto> Handle(CreateTestimonialCommand request, CancellationToken cancellationToken)
    {
        var testimonial = new Testimonial
        {
            ClientName = request.ClientName,
            Company = request.Company,
            Position = request.Position,
            Content = request.Content,
            AvatarUrl = request.AvatarUrl,
            CompanyLogoUrl = request.CompanyLogoUrl,
            Rating = request.Rating,
            IsActive = request.IsActive,
            DisplayOrder = request.DisplayOrder
        };

        await _repository.AddAsync(testimonial, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _cache.RemoveByPrefix("testimonials");

        return new TestimonialDto
        {
            Id = testimonial.Id,
            ClientName = testimonial.ClientName,
            Company = testimonial.Company,
            Position = testimonial.Position,
            Content = testimonial.Content,
            AvatarUrl = testimonial.AvatarUrl,
            CompanyLogoUrl = testimonial.CompanyLogoUrl,
            Rating = testimonial.Rating,
            IsActive = testimonial.IsActive,
            DisplayOrder = testimonial.DisplayOrder
        };
    }
}