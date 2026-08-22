using FluentValidation;

namespace CloudServices.Application.Features.Affiliates.Commands.CreateAffiliate;

public sealed class CreateAffiliateCommandValidator : AbstractValidator<CreateAffiliateCommand>
{
    public CreateAffiliateCommandValidator()
    {
        RuleFor(a => a.FullName)
            .NotEmpty()
            .MinimumLength(2)
            .MaximumLength(100);

        RuleFor(a => a.Email)
            .NotEmpty()
            .EmailAddress();

        RuleFor(a => a.Phone)
            .NotEmpty()
            .MinimumLength(9)
            .MaximumLength(15);
    }
}
