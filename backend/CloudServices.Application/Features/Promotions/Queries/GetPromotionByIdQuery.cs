using CloudServices.Application.Features.Promotions.DTOs;
using MediatR;

namespace CloudServices.Application.Features.Promotions.Queries;

public record GetPromotionByIdQuery(Guid Id) : IRequest<PromotionDto?>;