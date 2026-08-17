using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Domain.Entities;
using MediatR;

namespace CloudServices.Application.Features.Testimonials.Commands;

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
        var testimonial = await _repository.GetByIdAsync(request.Id, cancellationToken);
        if (testimonial == null)
        {
            throw new NotFoundException($"Testimonial with ID {request.Id} was not found.");
        }

        _repository.Delete(testimonial);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }
}