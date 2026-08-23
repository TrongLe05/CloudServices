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
        var existing = await affiliateRepository.GetByEmailAsync(request.Email.Trim(), cancellationToken);
        if (existing != null)
        {
            // Cập nhật lại thông tin mới nhất và đưa về trạng thái New (Chờ duyệt)
            existing.FullName = request.FullName.Trim();
            existing.Phone = request.Phone.Trim();
            existing.WebsiteUrl = request.WebsiteUrl?.Trim();
            existing.Motivation = request.Motivation?.Trim();
            existing.Status = AffiliateStatus.New;

            affiliateRepository.Update(existing);
            await unitOfWork.SaveChangesAsync(cancellationToken);
            return existing.Id;
        }

        var newAffiliate = new AffiliateApplication
        {
            FullName = request.FullName.Trim(),
            Email = request.Email.Trim(),
            Phone = request.Phone.Trim(),
            WebsiteUrl = request.WebsiteUrl?.Trim(),
            Motivation = request.Motivation?.Trim(),
            Status = AffiliateStatus.New
        };

        await affiliateRepository.AddAsync(newAffiliate, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return newAffiliate.Id;
    }
}
