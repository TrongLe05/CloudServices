using CloudServices.Application.Features.Testimonials.DTOs;
using MediatR;

namespace CloudServices.Application.Features.Testimonials.Commands;

public record CreateTestimonialCommand(
    string ClientName,
    string? Company,
    string? Position,
    string Content,
    string? AvatarUrl,
    string? CompanyLogoUrl,
    int Rating,
    bool IsActive,
    int DisplayOrder
) : IRequest<TestimonialDto>;