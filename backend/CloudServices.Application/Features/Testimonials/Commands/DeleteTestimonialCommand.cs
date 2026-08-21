using MediatR;

namespace CloudServices.Application.Features.Testimonials.Commands;

public record DeleteTestimonialCommand(Guid Id) : IRequest<bool>;