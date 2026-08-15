using System.Text.Json.Serialization;
using CloudServices.Application.Features.Promotions.DTOs;
using MediatR;

namespace CloudServices.Application.Features.Promotions.Commands;

public class UpdatePromotionCommand : IRequest<PromotionDto?>
{
    [JsonIgnore]
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int DiscountPercentage { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}