using FluentValidation;
namespace CloudServices.Application.Features.News.Commands.CreateNews;
public sealed class CreateNewsCommandValidator : AbstractValidator<CreateNewsCommand>
{ public CreateNewsCommandValidator() { RuleFor(x => x.Title).NotEmpty().MaximumLength(250); RuleFor(x => x.Slug).NotEmpty().MaximumLength(250); RuleFor(x => x.Category).NotEmpty().MaximumLength(100); RuleFor(x => x.Content).NotEmpty(); } }
