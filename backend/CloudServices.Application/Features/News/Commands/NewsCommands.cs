using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Domain.Entities;
using FluentValidation;
using MediatR;

namespace CloudServices.Application.Features.News.Commands;

public sealed record CreateNewsCommand(string Title, string Slug, string Category, string Content, string? ThumbnailUrl, DateTime? PublishedAt) : IRequest<Guid>;
public sealed record UpdateNewsCommand(Guid Id, string Title, string Slug, string Category, string Content, string? ThumbnailUrl, DateTime? PublishedAt) : IRequest;
public sealed record DeleteNewsCommand(Guid Id) : IRequest;

public sealed class NewsCommandValidator : AbstractValidator<CreateNewsCommand>
{
    public NewsCommandValidator() { RuleFor(x => x.Title).NotEmpty().MaximumLength(250); RuleFor(x => x.Slug).NotEmpty().MaximumLength(250); RuleFor(x => x.Category).NotEmpty().MaximumLength(100); RuleFor(x => x.Content).NotEmpty(); }
}
public sealed class UpdateNewsCommandValidator : AbstractValidator<UpdateNewsCommand>
{
    public UpdateNewsCommandValidator() { RuleFor(x => x.Title).NotEmpty().MaximumLength(250); RuleFor(x => x.Slug).NotEmpty().MaximumLength(250); RuleFor(x => x.Category).NotEmpty().MaximumLength(100); RuleFor(x => x.Content).NotEmpty(); }
}
public sealed class CreateNewsCommandHandler(INewsRepository repository, IUnitOfWork unitOfWork) : IRequestHandler<CreateNewsCommand, Guid>
{
    public async Task<Guid> Handle(CreateNewsCommand r, CancellationToken ct) { var a = new NewsArticle { Title = r.Title.Trim(), Slug = r.Slug.Trim(), Category = r.Category.Trim(), Content = r.Content, ThumbnailUrl = r.ThumbnailUrl, PublishedAt = r.PublishedAt }; await repository.AddAsync(a, ct); await unitOfWork.SaveChangesAsync(ct); return a.Id; }
}
public sealed class UpdateNewsCommandHandler(INewsRepository repository, IUnitOfWork unitOfWork) : IRequestHandler<UpdateNewsCommand>
{
    public async Task Handle(UpdateNewsCommand r, CancellationToken ct) { var a = await repository.GetByIdAsync(r.Id, ct) ?? throw new NotFoundException("News article was not found."); a.Title = r.Title.Trim(); a.Slug = r.Slug.Trim(); a.Category = r.Category.Trim(); a.Content = r.Content; a.ThumbnailUrl = r.ThumbnailUrl; a.PublishedAt = r.PublishedAt; repository.Update(a); await unitOfWork.SaveChangesAsync(ct); }
}
public sealed class DeleteNewsCommandHandler(INewsRepository repository, IUnitOfWork unitOfWork) : IRequestHandler<DeleteNewsCommand>
{
    public async Task Handle(DeleteNewsCommand r, CancellationToken ct) { var a = await repository.GetByIdAsync(r.Id, ct) ?? throw new NotFoundException("News article was not found."); repository.Delete(a); await unitOfWork.SaveChangesAsync(ct); }
}
