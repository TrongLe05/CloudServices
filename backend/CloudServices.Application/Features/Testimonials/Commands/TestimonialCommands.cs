using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.Testimonials.DTOs;
using CloudServices.Domain.Entities;
using MediatR;

namespace CloudServices.Application.Features.Testimonials.Commands;

// CREATE
public record CreateTestimonialCommand(CreateTestimonialDto Dto) : IRequest<TestimonialDto>;

public class CreateTestimonialCommandHandler : IRequestHandler<CreateTestimonialCommand, TestimonialDto>
{
    private readonly ITestimonialRepository _repository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateTestimonialCommandHandler(ITestimonialRepository repository, IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<TestimonialDto> Handle(CreateTestimonialCommand request, CancellationToken cancellationToken)
    {
        var entity = new Testimonial
        {
            Id = Guid.NewGuid(),
            ClientName = request.Dto.ClientName,
            Company = request.Dto.Company,
            Position = request.Dto.Position,
            Content = request.Dto.Content,
            AvatarUrl = request.Dto.AvatarUrl,
            CompanyLogoUrl = request.Dto.CompanyLogoUrl,
            Rating = request.Dto.Rating,
            IsActive = request.Dto.IsActive,
            DisplayOrder = request.Dto.DisplayOrder,
            CreatedAt = DateTime.UtcNow
        };

        await _repository.AddAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new TestimonialDto
        {
            Id = entity.Id,
            ClientName = entity.ClientName,
            Company = entity.Company,
            Position = entity.Position,
            Content = entity.Content,
            AvatarUrl = entity.AvatarUrl,
            CompanyLogoUrl = entity.CompanyLogoUrl,
            Rating = entity.Rating,
            IsActive = entity.IsActive,
            DisplayOrder = entity.DisplayOrder,
            CreatedAt = entity.CreatedAt
        };
    }
}

// UPDATE
public record UpdateTestimonialCommand(Guid Id, UpdateTestimonialDto Dto) : IRequest<TestimonialDto?>;

public class UpdateTestimonialCommandHandler : IRequestHandler<UpdateTestimonialCommand, TestimonialDto?>
{
    private readonly ITestimonialRepository _repository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateTestimonialCommandHandler(ITestimonialRepository repository, IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<TestimonialDto?> Handle(UpdateTestimonialCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetByIdAsync(request.Id, cancellationToken);
        if (entity == null) return null;

        entity.ClientName = request.Dto.ClientName;
        entity.Company = request.Dto.Company;
        entity.Position = request.Dto.Position;
        entity.Content = request.Dto.Content;
        entity.AvatarUrl = request.Dto.AvatarUrl;
        entity.CompanyLogoUrl = request.Dto.CompanyLogoUrl;
        entity.Rating = request.Dto.Rating;
        entity.IsActive = request.Dto.IsActive;
        entity.DisplayOrder = request.Dto.DisplayOrder;
        entity.UpdatedAt = DateTime.UtcNow;

        _repository.Update(entity);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new TestimonialDto
        {
            Id = entity.Id,
            ClientName = entity.ClientName,
            Company = entity.Company,
            Position = entity.Position,
            Content = entity.Content,
            AvatarUrl = entity.AvatarUrl,
            CompanyLogoUrl = entity.CompanyLogoUrl,
            Rating = entity.Rating,
            IsActive = entity.IsActive,
            DisplayOrder = entity.DisplayOrder,
            CreatedAt = entity.CreatedAt
        };
    }
}

// DELETE
public record DeleteTestimonialCommand(Guid Id) : IRequest<bool>;

public class DeleteTestimonialCommandHandler : IRequestHandler<DeleteTestimonialCommand, bool>
{
    private readonly ITestimonialRepository _repository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteTestimonialCommandHandler(ITestimonialRepository repository, IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(DeleteTestimonialCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetByIdAsync(request.Id, cancellationToken);
        if (entity == null) return false;

        _repository.Delete(entity);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return true;
    }
}