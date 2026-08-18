using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Domain.Entities;
using CloudServices.Domain.Enums;
using MediatR;

namespace CloudServices.Application.Features.Affiliates.Commands.CreateAffiliate;

public sealed class CreateAffiliateCommandHandler(IAffiliateApplicationRepository affiliateRepository, IUnitOfWork unitOfWork) : IRequestHandler<CreateAffiliateCommand, Guid>
{
    public async Task<Guid> Handle(CreateAffiliateCommand request, CancellationToken cancellationToken)
    {
        var newAffiliate = new AffiliateApplication
        {
            FullName = request.FullName,
            Email = request.Email,
            Phone = request.Phone,
            WebsiteUrl = request.WebsiteUrl,
            Motivation = request.Motivation,
            Status = AffiliateStatus.New
        };

        await affiliateRepository.AddAsync(newAffiliate, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return newAffiliate.Id;
    }
}
