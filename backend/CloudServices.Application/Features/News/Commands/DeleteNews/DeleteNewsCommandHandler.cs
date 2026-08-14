using CloudServices.Application.Common.Interfaces.Repositories;
using MediatR;

namespace CloudServices.Application.Features.News.Commands.DeleteNews;

public class DeleteNewsCommandHandler : IRequestHandler<DeleteNewsCommand>
{
    private readonly INewsRepository _newsRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteNewsCommandHandler(INewsRepository newsRepository, IUnitOfWork unitOfWork)
    {
        _newsRepository = newsRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Unit> Handle(DeleteNewsCommand request, CancellationToken cancellationToken)
    {
        await _newsRepository.DeleteAsync(request.Id, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}
