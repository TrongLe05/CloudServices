using FluentValidation;
namespace CloudServices.Application.Features.News.Commands.UpdateNews;
public sealed class UpdateNewsCommandValidator : AbstractValidator<UpdateNewsCommand>
{ public UpdateNewsCommandValidator() { RuleFor(x => x.Title).NotEmpty().MaximumLength(250); RuleFor(x => x.Slug).NotEmpty().MaximumLength(250); RuleFor(x => x.Category).NotEmpty().MaximumLength(100); RuleFor(x => x.Content).NotEmpty(); } }
