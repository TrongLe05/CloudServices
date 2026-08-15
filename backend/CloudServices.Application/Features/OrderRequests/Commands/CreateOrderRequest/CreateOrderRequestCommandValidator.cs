using FluentValidation;
namespace CloudServices.Application.Features.OrderRequests.Commands.CreateOrderRequest;
public sealed class CreateOrderRequestCommandValidator : AbstractValidator<CreateOrderRequestCommand>
{ public CreateOrderRequestCommandValidator() { RuleFor(x => x.ServicePlanId).NotEmpty(); RuleFor(x => x.BillingCycle).NotEmpty().MaximumLength(50); RuleFor(x => x.CustomerName).NotEmpty().MaximumLength(100); RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(100); RuleFor(x => x.Phone).NotEmpty().MaximumLength(20); RuleFor(x => x.CompanyName).MaximumLength(150); } }
