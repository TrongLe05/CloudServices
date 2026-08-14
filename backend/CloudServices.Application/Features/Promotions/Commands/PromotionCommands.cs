using MediatR;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Domain.Entities;

namespace CloudServices.Application.Features.Promotions.Commands;

// 1. CREATE COMMAND
public record CreatePromotionCommand(string Name, int DiscountPercentage, DateTime StartDate, DateTime EndDate) : IRequest<Guid>;

public class CreatePromotionCommandHandler : IRequestHandler<CreatePromotionCommand, Guid>
{
    private readonly IPromotionRepository _promotionRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreatePromotionCommandHandler(IPromotionRepository promotionRepository, IUnitOfWork unitOfWork)
    {
        _promotionRepository = promotionRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(CreatePromotionCommand request, CancellationToken cancellationToken)
    {
        var promotion = new Promotion
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            DiscountPercentage = request.DiscountPercentage,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            IsActive = true
        };

        await _promotionRepository.AddAsync(promotion, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return promotion.Id;
    }
}

// 2. UPDATE COMMAND
public record UpdatePromotionCommand(Guid Id, string Name, int DiscountPercentage, DateTime StartDate, DateTime EndDate, bool IsActive) : IRequest<bool>;

public class UpdatePromotionCommandHandler : IRequestHandler<UpdatePromotionCommand, bool>
{
    private readonly IPromotionRepository _promotionRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdatePromotionCommandHandler(IPromotionRepository promotionRepository, IUnitOfWork unitOfWork)
    {
        _promotionRepository = promotionRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(UpdatePromotionCommand request, CancellationToken cancellationToken)
    {
        var promotion = await _promotionRepository.GetByIdAsync(request.Id, cancellationToken);
        if (promotion == null) return false;

        promotion.Name = request.Name;
        promotion.DiscountPercentage = request.DiscountPercentage;
        promotion.StartDate = request.StartDate;
        promotion.EndDate = request.EndDate;
        promotion.IsActive = request.IsActive;

        _promotionRepository.Update(promotion);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }
}

// 3. DELETE COMMAND
public record DeletePromotionCommand(Guid Id) : IRequest<bool>;

public class DeletePromotionCommandHandler : IRequestHandler<DeletePromotionCommand, bool>
{
    private readonly IPromotionRepository _promotionRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeletePromotionCommandHandler(IPromotionRepository promotionRepository, IUnitOfWork unitOfWork)
    {
        _promotionRepository = promotionRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(DeletePromotionCommand request, CancellationToken cancellationToken)
    {
        var promotion = await _promotionRepository.GetByIdAsync(request.Id, cancellationToken);
        if (promotion == null) return false;

        _promotionRepository.Delete(promotion);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }
}