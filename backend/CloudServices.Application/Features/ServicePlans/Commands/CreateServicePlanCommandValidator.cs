using FluentValidation;
namespace CloudServices.Application.Features.ServicePlans.Commands;
public sealed class CreateServicePlanCommandValidator : AbstractValidator<CreateServicePlanCommand>
{ public CreateServicePlanCommandValidator() { RuleFor(x => x.CategoryId).NotEmpty(); RuleFor(x => x.Name).NotEmpty().MaximumLength(100); } }
