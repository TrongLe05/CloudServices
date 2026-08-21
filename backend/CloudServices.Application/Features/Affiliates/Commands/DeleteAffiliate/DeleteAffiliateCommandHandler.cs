using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using MediatR;

namespace CloudServices.Application.Features.Affiliates.Commands.DeleteAffiliate;

public sealed class DeleteAffiliateCommandHandler(IAffiliateApplicationRepository repository, IUnitOfWork unitOfWork) : IRequestHandler<DeleteAffiliateCommand>
{
    public async Task Handle(DeleteAffiliateCommand request, CancellationToken cancellationToken)
    {
        var affiliate = await repository.GetByIdAsync(request.Id, cancellationToken) 
            ?? throw new NotFoundException("Affiliate not found");

        repository.Delete(affiliate);

        await unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
