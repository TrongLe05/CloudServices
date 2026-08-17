using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using MediatR;
namespace CloudServices.Application.Features.News.Commands.DeleteNews;
public sealed class DeleteNewsCommandHandler(INewsRepository repository, IUnitOfWork unitOfWork) : IRequestHandler<DeleteNewsCommand>
{ public async Task Handle(DeleteNewsCommand request, CancellationToken cancellationToken) { var article = await repository.GetByIdAsync(request.Id, cancellationToken) ?? throw new NotFoundException("News article was not found."); repository.Delete(article); await unitOfWork.SaveChangesAsync(cancellationToken); } }
