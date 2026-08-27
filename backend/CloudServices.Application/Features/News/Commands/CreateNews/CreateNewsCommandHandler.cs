using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Domain.Entities;
using MediatR;
namespace CloudServices.Application.Features.News.Commands.CreateNews;

public sealed class CreateNewsCommandHandler(INewsRepository repository, IUnitOfWork unitOfWork, ICacheService cache) : IRequestHandler<CreateNewsCommand, Guid>
{
    public async Task<Guid> Handle(CreateNewsCommand request, CancellationToken cancellationToken)
    {
        var article = new NewsArticle
        {
            Title = request.Title.Trim(),
            Slug = request.Slug.Trim(),
            Category = request.Category.Trim(),
            Content = request.Content,
            ThumbnailUrl = request.ThumbnailUrl,
            PublishedAt = request.PublishedAt
        };
        await repository.AddAsync(article, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        cache.RemoveByPrefix("news");

        return article.Id;
    }
}
