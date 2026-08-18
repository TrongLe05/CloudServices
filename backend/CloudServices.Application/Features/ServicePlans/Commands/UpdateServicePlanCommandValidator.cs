using FluentValidation;
namespace CloudServices.Application.Features.ServicePlans.Commands;
public sealed class UpdateServicePlanCommandValidator : AbstractValidator<UpdateServicePlanCommand>
{ public UpdateServicePlanCommandValidator() { RuleFor(x => x.CategoryId).NotEmpty(); RuleFor(x => x.Name).NotEmpty().MaximumLength(100); } }
