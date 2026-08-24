using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.News.Commands.CreateNews;
using CloudServices.Application.Features.News.Commands.DeleteNews;
using CloudServices.Application.Features.News.Commands.UpdateNews;
using CloudServices.Domain.Entities;
using Moq;
using System;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace CloudServices.UnitTests.Features.News;

public class NewsCommandHandlerTests
{
    private readonly Mock<INewsRepository> _repositoryMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<ICacheService> _cacheMock;

    public NewsCommandHandlerTests()
    {
        _repositoryMock = new Mock<INewsRepository>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _cacheMock = new Mock<ICacheService>();
    }

    [Fact]
    public async Task CreateNews_ValidRequest_CreatesNewsAndReturnsId()
    {
        // Arrange
        var handler = new CreateNewsCommandHandler(_repositoryMock.Object, _unitOfWorkMock.Object, _cacheMock.Object);
        var command = new CreateNewsCommand("Title ", "Slug ", "Category ", "Content", "http://thumb.url", null);

        _repositoryMock.Setup(repo => repo.AddAsync(It.IsAny<NewsArticle>(), It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        _unitOfWorkMock.Setup(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.NotEqual(Guid.Empty, result);
        _repositoryMock.Verify(repo => repo.AddAsync(It.Is<NewsArticle>(a =>
            a.Title == "Title" &&
            a.Slug == "Slug" &&
            a.Category == "Category" &&
            a.Content == "Content" &&
            a.ThumbnailUrl == "http://thumb.url"
        ), It.IsAny<CancellationToken>()), Times.Once);
        _unitOfWorkMock.Verify(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task UpdateNews_ArticleNotFound_ThrowsNotFoundException()
    {
        // Arrange
        var handler = new UpdateNewsCommandHandler(_repositoryMock.Object, _unitOfWorkMock.Object, _cacheMock.Object);
        var command = new UpdateNewsCommand(Guid.NewGuid(), "Title", "Slug", "Category", "Content", null, null);

        _repositoryMock.Setup(repo => repo.GetByIdAsync(command.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync((NewsArticle?)null);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(() => handler.Handle(command, CancellationToken.None));
    }

    [Fact]
    public async Task UpdateNews_ArticleFound_UpdatesAndSaves()
    {
        // Arrange
        var handler = new UpdateNewsCommandHandler(_repositoryMock.Object, _unitOfWorkMock.Object, _cacheMock.Object);
        var articleId = Guid.NewGuid();
        var command = new UpdateNewsCommand(articleId, "New Title ", "New Slug ", "New Category ", "New Content", "new_url", null);
        var article = new NewsArticle { Id = articleId, Title = "Old Title", Slug = "old-slug", Category = "old-cat" };

        _repositoryMock.Setup(repo => repo.GetByIdAsync(articleId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(article);

        _repositoryMock.Setup(repo => repo.Update(article));
        _unitOfWorkMock.Setup(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        // Act
        await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.Equal("New Title", article.Title);
        Assert.Equal("New Slug", article.Slug);
        Assert.Equal("New Category", article.Category);
        Assert.Equal("New Content", article.Content);
        Assert.Equal("new_url", article.ThumbnailUrl);

        _repositoryMock.Verify(repo => repo.Update(article), Times.Once);
        _unitOfWorkMock.Verify(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task DeleteNews_ArticleNotFound_ThrowsNotFoundException()
    {
        // Arrange
        var handler = new DeleteNewsCommandHandler(_repositoryMock.Object, _unitOfWorkMock.Object, _cacheMock.Object);
        var command = new DeleteNewsCommand(Guid.NewGuid());

        _repositoryMock.Setup(repo => repo.GetByIdAsync(command.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync((NewsArticle?)null);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(() => handler.Handle(command, CancellationToken.None));
    }

    [Fact]
    public async Task DeleteNews_ArticleFound_DeletesAndSaves()
    {
        // Arrange
        var handler = new DeleteNewsCommandHandler(_repositoryMock.Object, _unitOfWorkMock.Object, _cacheMock.Object);
        var articleId = Guid.NewGuid();
        var command = new DeleteNewsCommand(articleId);
        var article = new NewsArticle { Id = articleId, Title = "Title" };

        _repositoryMock.Setup(repo => repo.GetByIdAsync(articleId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(article);

        _repositoryMock.Setup(repo => repo.Delete(article));
        _unitOfWorkMock.Setup(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        // Act
        await handler.Handle(command, CancellationToken.None);

        // Assert
        _repositoryMock.Verify(repo => repo.Delete(article), Times.Once);
        _unitOfWorkMock.Verify(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}
