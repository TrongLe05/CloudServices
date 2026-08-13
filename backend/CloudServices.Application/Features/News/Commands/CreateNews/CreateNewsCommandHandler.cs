using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.News.Commands.CreateNews;
using CloudServices.Domain.Entities;
using MediatR;

namespace CloudServices.Application.Features.News.Commands.CreateNews;

public class CreateNewsCommandHandler : IRequestHandler<CreateNewsCommand, Guid>
{
    private readonly INewsRepository _newsRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateNewsCommandHandler(INewsRepository newsRepository, IUnitOfWork unitOfWork)
    {
        _newsRepository = newsRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(CreateNewsCommand request, CancellationToken cancellationToken)
    {
        var article = new NewsArticle
        {
            Id = Guid.NewGuid(),
            Title = request.Title,
            Slug = request.Slug,
            Content = request.Content,
            ThumbnailUrl = request.ThumbnailUrl,
            PublishedAt = request.PublishedAt,
            AuthorId = request.AuthorId
        };

        await _newsRepository.AddAsync(article, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return article.Id;
    }
}
