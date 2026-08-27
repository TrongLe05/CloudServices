using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using MediatR;

namespace CloudServices.Application.Features.News.Commands.UpdateNews;

public sealed class UpdateNewsCommandHandler(INewsRepository repository, IUnitOfWork unitOfWork, ICacheService cache) : IRequestHandler<UpdateNewsCommand>
{
    public async Task Handle(UpdateNewsCommand request, CancellationToken cancellationToken)
    {
        var article = await repository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException("News article was not found.");

        article.Title = request.Title.Trim();
        article.Slug = request.Slug.Trim();
        article.Category = request.Category.Trim();
        article.Content = request.Content;
        article.ThumbnailUrl = request.ThumbnailUrl;
        article.PublishedAt = request.PublishedAt;

        repository.Update(article);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        cache.RemoveByPrefix("news");
    }
}
