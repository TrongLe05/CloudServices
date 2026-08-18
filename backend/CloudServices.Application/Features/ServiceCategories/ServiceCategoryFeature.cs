using CloudServices.Application.Common.Interfaces;
using CloudServices.Domain.Entities;
using FluentValidation;
using MediatR;

namespace CloudServices.Application.Features.ServiceCategories;

public sealed record ServiceCategoryDto(Guid Id, string Name, string Slug, string? Description)
{
    public static ServiceCategoryDto FromEntity(ServiceCategory category) =>
        new(category.Id, category.Name, category.Slug, category.Description);
}

public sealed record GetServiceCategoriesQuery : IRequest<IReadOnlyList<ServiceCategoryDto>>;

public sealed class GetServiceCategoriesQueryHandler(IServiceCategoryRepository categories)
    : IRequestHandler<GetServiceCategoriesQuery, IReadOnlyList<ServiceCategoryDto>>
{
    public async Task<IReadOnlyList<ServiceCategoryDto>> Handle(
        GetServiceCategoriesQuery request,
        CancellationToken cancellationToken)
    {
        var result = await categories.GetAllAsync(cancellationToken);
        return result.Select(ServiceCategoryDto.FromEntity).ToList();
    }
}

public sealed record GetServiceCategoryByIdQuery(Guid Id) : IRequest<ServiceCategoryDto?>;

public sealed class GetServiceCategoryByIdQueryHandler(IServiceCategoryRepository categories)
    : IRequestHandler<GetServiceCategoryByIdQuery, ServiceCategoryDto?>
{
    public async Task<ServiceCategoryDto?> Handle(
        GetServiceCategoryByIdQuery request,
        CancellationToken cancellationToken)
    {
        var category = await categories.GetByIdAsync(request.Id, cancellationToken);
        return category is null ? null : ServiceCategoryDto.FromEntity(category);
    }
}

public sealed record CreateServiceCategoryCommand(string Name, string Slug, string? Description)
    : IRequest<Guid>;

public sealed class CreateServiceCategoryCommandHandler(IServiceCategoryRepository categories)
    : IRequestHandler<CreateServiceCategoryCommand, Guid>
{
    public async Task<Guid> Handle(CreateServiceCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = new ServiceCategory
        {
            Name = request.Name.Trim(),
            Slug = request.Slug.Trim().ToLowerInvariant(),
            Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim()
        };

        await categories.AddAsync(category, cancellationToken);
        await categories.SaveChangesAsync(cancellationToken);
        return category.Id;
    }
}

public sealed class CreateServiceCategoryCommandValidator : AbstractValidator<CreateServiceCategoryCommand>
{
    public CreateServiceCategoryCommandValidator(IServiceCategoryRepository categories)
    {
        RuleFor(command => command.Name).NotEmpty().MaximumLength(100);
        RuleFor(command => command.Slug)
            .NotEmpty()
            .MaximumLength(150)
            .Matches("^[a-z0-9]+(?:-[a-z0-9]+)*$")
            .MustAsync(async (slug, cancellationToken) =>
                !await categories.SlugExistsAsync(slug.Trim().ToLowerInvariant(), cancellationToken: cancellationToken))
            .WithMessage("Slug already exists.");
    }
}

public sealed record UpdateServiceCategoryCommand(Guid Id, string Name, string Slug, string? Description)
    : IRequest<bool>;

public sealed class UpdateServiceCategoryCommandHandler(IServiceCategoryRepository categories)
    : IRequestHandler<UpdateServiceCategoryCommand, bool>
{
    public async Task<bool> Handle(UpdateServiceCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await categories.GetByIdAsync(request.Id, cancellationToken);
        if (category is null)
        {
            return false;
        }

        category.Name = request.Name.Trim();
        category.Slug = request.Slug.Trim().ToLowerInvariant();
        category.Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim();

        await categories.SaveChangesAsync(cancellationToken);
        return true;
    }
}

public sealed class UpdateServiceCategoryCommandValidator : AbstractValidator<UpdateServiceCategoryCommand>
{
    public UpdateServiceCategoryCommandValidator(IServiceCategoryRepository categories)
    {
        RuleFor(command => command.Name).NotEmpty().MaximumLength(100);
        RuleFor(command => command.Slug)
            .NotEmpty()
            .MaximumLength(150)
            .Matches("^[a-z0-9]+(?:-[a-z0-9]+)*$")
            .MustAsync(async (command, slug, cancellationToken) =>
                !await categories.SlugExistsAsync(
                    slug.Trim().ToLowerInvariant(),
                    command.Id,
                    cancellationToken))
            .WithMessage("Slug already exists.");
    }
}

public sealed record DeleteServiceCategoryCommand(Guid Id) : IRequest<bool>;

public sealed class DeleteServiceCategoryCommandHandler(IServiceCategoryRepository categories)
    : IRequestHandler<DeleteServiceCategoryCommand, bool>
{
    public async Task<bool> Handle(DeleteServiceCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await categories.GetByIdAsync(request.Id, cancellationToken);
        if (category is null)
        {
            return false;
        }

        categories.Remove(category);
        await categories.SaveChangesAsync(cancellationToken);
        return true;
    }
}
