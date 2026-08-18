using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.Testimonials.DTOs;
using CloudServices.Domain.Entities;
using MediatR;

namespace CloudServices.Application.Features.Testimonials.Commands;

public class UpdateTestimonialCommandHandler : IRequestHandler<UpdateTestimonialCommand, TestimonialDto>
{
    private readonly ITestimonialRepository _repository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateTestimonialCommandHandler(ITestimonialRepository repository, IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<TestimonialDto> Handle(UpdateTestimonialCommand request, CancellationToken cancellationToken)
    {
        var testimonial = await _repository.GetByIdAsync(request.Id, cancellationToken);
        if (testimonial == null)
        {
            throw new NotFoundException($"Testimonial with ID {request.Id} was not found.");
        }

        testimonial.ClientName = request.ClientName;
        testimonial.Company = request.Company;
        testimonial.Position = request.Position;
        testimonial.Content = request.Content;
        testimonial.AvatarUrl = request.AvatarUrl;
        testimonial.CompanyLogoUrl = request.CompanyLogoUrl;
        testimonial.Rating = request.Rating;
        testimonial.IsActive = request.IsActive;
        testimonial.DisplayOrder = request.DisplayOrder;

        _repository.Update(testimonial);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

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