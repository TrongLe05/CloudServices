using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Exceptions.BadRequestException;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Domain.Enums;
using MediatR;

namespace CloudServices.Application.Features.Affiliates.Commands.ChangeAffiliateStatus;

public sealed class ChangeAffiliateStatusCommandHandler(IAffiliateApplicationRepository repository, IUnitOfWork unitOfWork) : IRequestHandler<ChangeAffiliateStatusCommand>
{
    public async Task Handle(ChangeAffiliateStatusCommand request, CancellationToken cancellationToken)
    {
        if (!Enum.TryParse<AffiliateStatus>(request.Status,true, out var status))
            throw new BadRequestException("Trạng thái đối tác (Affiliate Status) không hợp lệ.");

        var application = await repository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException("Đơn đăng ký đối tác liên kết không tồn tại.");

        application.Status = status;
        repository.Update(application);

        await unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
