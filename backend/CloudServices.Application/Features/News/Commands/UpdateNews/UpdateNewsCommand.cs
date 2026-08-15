using MediatR;
namespace CloudServices.Application.Features.News.Commands.UpdateNews;
public sealed record UpdateNewsCommand(Guid Id, string Title, string Slug, string Category, string Content, string? ThumbnailUrl, DateTime? PublishedAt) : IRequest;
