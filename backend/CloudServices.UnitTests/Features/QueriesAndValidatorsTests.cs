using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.News;
using CloudServices.Application.Features.News.Queries.GetNews;
using CloudServices.Application.Features.News.Queries.GetNewsById;
using CloudServices.Application.Features.News.Commands.CreateNews;
using CloudServices.Application.Features.Users.Commands.RegisterUser;
using CloudServices.Domain.Entities;
using Moq;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace CloudServices.UnitTests.Features;

public class QueriesAndValidatorsTests
{
    private readonly Mock<INewsRepository> _newsRepositoryMock;
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly Mock<ICacheService> _cacheMock;

    public QueriesAndValidatorsTests()
    {
        _newsRepositoryMock = new Mock<INewsRepository>();
        _userRepositoryMock = new Mock<IUserRepository>();
        _cacheMock = new Mock<ICacheService>();

        _cacheMock.Setup(c => c.GetOrCreateAsync(
            It.IsAny<string>(),
            It.IsAny<Func<CancellationToken, Task<NewsPage>>>(),
            It.IsAny<TimeSpan?>(),
            It.IsAny<CancellationToken>()))
            .Returns<string, Func<CancellationToken, Task<NewsPage>>, TimeSpan?, CancellationToken>((k, f, e, ct) => f(ct));

        _cacheMock.Setup(c => c.GetOrCreateAsync(
            It.IsAny<string>(),
            It.IsAny<Func<CancellationToken, Task<NewsDto>>>(),
            It.IsAny<TimeSpan?>(),
            It.IsAny<CancellationToken>()))
            .Returns<string, Func<CancellationToken, Task<NewsDto>>, TimeSpan?, CancellationToken>((k, f, e, ct) => f(ct));
    }

    [Fact]
    public async Task GetNewsQueryHandler_ReturnsPagedResult()
    {
        // Arrange
        var handler = new GetNewsQueryHandler(_newsRepositoryMock.Object, _cacheMock.Object);
        var query = new GetNewsQuery("test", "category", "sort", 1, 10);
        var fakeArticles = new List<NewsArticle>
        {
            new NewsArticle { Id = Guid.NewGuid(), Title = "Title 1", Slug = "slug-1", Category = "category", PublishedAt = DateTime.UtcNow }
        };

        _newsRepositoryMock.Setup(repo => repo.GetPagedAsync("test", "category", "sort", 1, 10, It.IsAny<CancellationToken>()))
            .ReturnsAsync((fakeArticles, 1));

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(1, result.TotalCount);
        Assert.Single(result.Items);
        Assert.Equal("Title 1", result.Items[0].Title);
    }

    [Fact]
    public async Task GetNewsByIdQueryHandler_NotFound_ThrowsNotFoundException()
    {
        // Arrange
        var handler = new GetNewsByIdQueryHandler(_newsRepositoryMock.Object, _cacheMock.Object);
        var query = new GetNewsByIdQuery(Guid.NewGuid());

        _newsRepositoryMock.Setup(repo => repo.GetByIdAsync(query.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync((NewsArticle?)null);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(() => handler.Handle(query, CancellationToken.None));
    }

    [Fact]
    public async Task GetNewsByIdQueryHandler_Found_ReturnsDto()
    {
        // Arrange
        var handler = new GetNewsByIdQueryHandler(_newsRepositoryMock.Object, _cacheMock.Object);
        var articleId = Guid.NewGuid();
        var query = new GetNewsByIdQuery(articleId);
        var article = new NewsArticle { Id = articleId, Title = "Article Title", Slug = "slug", Category = "cat", PublishedAt = DateTime.UtcNow };

        _newsRepositoryMock.Setup(repo => repo.GetByIdAsync(articleId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(article);

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(articleId, result.Id);
        Assert.Equal("Article Title", result.Title);
    }

    [Fact]
    public async Task CreateNewsCommandValidator_InvalidInputs_HaveErrors()
    {
        // Arrange
        var validator = new CreateNewsCommandValidator();
        var commandEmpty = new CreateNewsCommand("", "", "", "", null, null);
        var commandTooLong = new CreateNewsCommand(new string('a', 251), new string('b', 251), new string('c', 101), "content", null, null);

        // Act
        var resultEmpty = await validator.ValidateAsync(commandEmpty);
        var resultTooLong = await validator.ValidateAsync(commandTooLong);

        // Assert
        Assert.False(resultEmpty.IsValid);
        Assert.False(resultTooLong.IsValid);
    }

    [Fact]
    public async Task CreateNewsCommandValidator_ValidInputs_IsValid()
    {
        // Arrange
        var validator = new CreateNewsCommandValidator();
        var command = new CreateNewsCommand("Title", "Slug", "Category", "Content text", null, null);

        // Act
        var result = await validator.ValidateAsync(command);

        // Assert
        Assert.True(result.IsValid);
    }

    [Fact]
    public async Task RegisterUserCommandValidator_EmptyFields_HaveErrors()
    {
        // Arrange
        var validator = new RegisterUserCommandValidator(_userRepositoryMock.Object);
        var command = new RegisterUserCommand { Username = "", Email = "", Password = "", FullName = "" };

        // Act
        var result = await validator.ValidateAsync(command);

        // Assert
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "Username");
        Assert.Contains(result.Errors, e => e.PropertyName == "Email");
        Assert.Contains(result.Errors, e => e.PropertyName == "Password");
        Assert.Contains(result.Errors, e => e.PropertyName == "FullName");
    }

    [Fact]
    public async Task RegisterUserCommandValidator_DuplicateUsernameOrEmail_HaveErrors()
    {
        // Arrange
        var validator = new RegisterUserCommandValidator(_userRepositoryMock.Object);
        var command = new RegisterUserCommand { Username = "dupuser", Email = "dupemail@example.com", Password = "password123", FullName = "Name" };

        _userRepositoryMock.Setup(repo => repo.GetByUsernameAsync("dupuser", It.IsAny<CancellationToken>()))
            .ReturnsAsync(new AppUser()); // Username exists

        _userRepositoryMock.Setup(repo => repo.GetByEmailAsync("dupemail@example.com", It.IsAny<CancellationToken>()))
            .ReturnsAsync(new AppUser()); // Email exists

        // Act
        var result = await validator.ValidateAsync(command);

        // Assert
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.ErrorMessage.Contains("Tên tài khoản đã tồn tại."));
        Assert.Contains(result.Errors, e => e.ErrorMessage.Contains("Email đã được sử dụng."));
    }
}
