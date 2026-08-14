using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Domain.Entities;
using MediatR;

namespace CloudServices.Application.Features.News.Commands.UpdateNews;

public class UpdateNewsCommandHandler : IRequestHandler<UpdateNewsCommand>
{
    private readonly INewsRepository _newsRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateNewsCommandHandler(INewsRepository newsRepository, IUnitOfWork unitOfWork)
    {
        _newsRepository = newsRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Unit> Handle(UpdateNewsCommand request, CancellationToken cancellationToken)
    {
        var existing = await _newsRepository.GetByIdAsync(request.Id, cancellationToken);
        if (existing == null) throw new Exception("News not found");

        if (request.Title is not null) existing.Title = request.Title;
        if (request.Slug is not null) existing.Slug = request.Slug;
        if (request.Content is not null) existing.Content = request.Content;
        if (request.ThumbnailUrl is not null) existing.ThumbnailUrl = request.ThumbnailUrl;
        if (request.PublishedAt is not null) existing.PublishedAt = request.PublishedAt;
        if (request.AuthorId is not null) existing.AuthorId = request.AuthorId;

        await _newsRepository.UpdateAsync(existing, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
