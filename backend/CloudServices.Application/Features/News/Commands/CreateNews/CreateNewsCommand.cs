using MediatR;
namespace CloudServices.Application.Features.News.Commands.CreateNews;
public sealed record CreateNewsCommand(string Title, string Slug, string Category, string Content, string? ThumbnailUrl, DateTime? PublishedAt) : IRequest<Guid>;
