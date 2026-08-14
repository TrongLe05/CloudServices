using FluentValidation;

namespace CloudServices.Application.Features.OrderRequests.Commands.CreateOrderRequest;

public class CreateOrderRequestCommandValidator : AbstractValidator<CreateOrderRequestCommand>
{
    public CreateOrderRequestCommandValidator()
    {
        RuleFor(x => x.ServicePlanId)
            .NotEmpty().WithMessage("ServicePlanId là bắt buộc.");

        RuleFor(x => x.BillingCycle)
            .NotEmpty().WithMessage("BillingCycle là bắt buộc.")
            .Must(v => v == "Monthly" || v == "Annually" || v == "Quarterly")
            .WithMessage("BillingCycle không hợp lệ.");

        RuleFor(x => x.CustomerName)
            .NotEmpty().WithMessage("CustomerName là bắt buộc.")
            .MaximumLength(100).WithMessage("CustomerName không được vượt quá 100 ký tự.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email là bắt buộc.")
            .EmailAddress().WithMessage("Email không hợp lệ.");

        RuleFor(x => x.Phone)
            .NotEmpty().WithMessage("Phone là bắt buộc.")
            .MaximumLength(20).WithMessage("Phone không được vượt quá 20 ký tự.");

        RuleFor(x => x.CompanyName)
            .MaximumLength(150).WithMessage("CompanyName không được vượt quá 150 ký tự.");
    }
}
