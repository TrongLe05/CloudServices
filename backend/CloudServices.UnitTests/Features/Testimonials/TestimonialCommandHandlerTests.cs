using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Application.Features.Testimonials.Commands;
using CloudServices.Domain.Entities;
using Moq;
using System;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace CloudServices.UnitTests.Features.Testimonials;

public class TestimonialCommandHandlerTests
{
    private readonly Mock<ITestimonialRepository> _repositoryMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<ICacheService> _cacheMock;

    public TestimonialCommandHandlerTests()
    {
        _repositoryMock = new Mock<ITestimonialRepository>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _cacheMock = new Mock<ICacheService>();
    }

    [Fact]
    public async Task CreateTestimonial_ValidRequest_CreatesAndSaves()
    {
        // Arrange
        var handler = new CreateTestimonialCommandHandler(_repositoryMock.Object, _unitOfWorkMock.Object, _cacheMock.Object);
        var command = new CreateTestimonialCommand("Jane Doe", "Google", "Engineer", "Excellent service", "http://avatar", "http://logo", 5, true, 1);

        _repositoryMock.Setup(repo => repo.AddAsync(It.IsAny<Testimonial>(), It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);
        _unitOfWorkMock.Setup(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.NotEqual(Guid.Empty, result.Id);
        Assert.Equal("Jane Doe", result.ClientName);
        Assert.Equal("Google", result.Company);
        Assert.Equal("Engineer", result.Position);
        Assert.Equal("Excellent service", result.Content);
        Assert.Equal(5, result.Rating);

        _repositoryMock.Verify(repo => repo.AddAsync(It.Is<Testimonial>(t =>
            t.ClientName == "Jane Doe" &&
            t.Company == "Google" &&
            t.Position == "Engineer" &&
            t.Content == "Excellent service" &&
            t.Rating == 5 &&
            t.IsActive &&
            t.DisplayOrder == 1
        ), It.IsAny<CancellationToken>()), Times.Once);
        _unitOfWorkMock.Verify(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task DeleteTestimonial_NotFound_ThrowsNotFoundException()
    {
        // Arrange
        var handler = new DeleteTestimonialCommandHandler(_repositoryMock.Object, _unitOfWorkMock.Object, _cacheMock.Object);
        var command = new DeleteTestimonialCommand(Guid.NewGuid());

        _repositoryMock.Setup(repo => repo.GetByIdAsync(command.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Testimonial?)null);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(() => handler.Handle(command, CancellationToken.None));
    }

    [Fact]
    public async Task DeleteTestimonial_Found_DeletesAndSaves()
    {
        // Arrange
        var handler = new DeleteTestimonialCommandHandler(_repositoryMock.Object, _unitOfWorkMock.Object, _cacheMock.Object);
        var id = Guid.NewGuid();
        var command = new DeleteTestimonialCommand(id);
        var testimonial = new Testimonial { Id = id };

        _repositoryMock.Setup(repo => repo.GetByIdAsync(id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(testimonial);
        _repositoryMock.Setup(repo => repo.Delete(testimonial));
        _unitOfWorkMock.Setup(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.True(result);
        _repositoryMock.Verify(repo => repo.Delete(testimonial), Times.Once);
        _unitOfWorkMock.Verify(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task UpdateTestimonial_NotFound_ThrowsNotFoundException()
    {
        // Arrange
        var handler = new UpdateTestimonialCommandHandler(_repositoryMock.Object, _unitOfWorkMock.Object, _cacheMock.Object);
        var command = new UpdateTestimonialCommand(Guid.NewGuid(), "Jane", null, null, "Cool", null, null, 5, true, 1);

        _repositoryMock.Setup(repo => repo.GetByIdAsync(command.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Testimonial?)null);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(() => handler.Handle(command, CancellationToken.None));
    }

    [Fact]
    public async Task UpdateTestimonial_Found_UpdatesAndSaves()
    {
        // Arrange
        var handler = new UpdateTestimonialCommandHandler(_repositoryMock.Object, _unitOfWorkMock.Object, _cacheMock.Object);
        var id = Guid.NewGuid();
        var command = new UpdateTestimonialCommand(id, "Jane 2", "Microsoft", "Lead", "Awesomeness", "avatar2", "logo2", 4, false, 2);
        var testimonial = new Testimonial { Id = id, ClientName = "Jane", Content = "Good" };

        _repositoryMock.Setup(repo => repo.GetByIdAsync(id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(testimonial);
        _repositoryMock.Setup(repo => repo.Update(testimonial));
        _unitOfWorkMock.Setup(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Jane 2", testimonial.ClientName);
        Assert.Equal("Microsoft", testimonial.Company);
        Assert.Equal("Lead", testimonial.Position);
        Assert.Equal("Awesomeness", testimonial.Content);
        Assert.Equal(4, testimonial.Rating);
        Assert.False(testimonial.IsActive);
        Assert.Equal(2, testimonial.DisplayOrder);

        _repositoryMock.Verify(repo => repo.Update(testimonial), Times.Once);
        _unitOfWorkMock.Verify(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}
