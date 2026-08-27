using CloudServices.Infrastructure.Services;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace CloudServices.UnitTests.Infrastructure;

public class MemoryCacheServiceTests
{
    private readonly IMemoryCache _memoryCache;
    private readonly Mock<ILogger<MemoryCacheService>> _loggerMock;

    public MemoryCacheServiceTests()
    {
        _memoryCache = new MemoryCache(new MemoryCacheOptions());
        _loggerMock = new Mock<ILogger<MemoryCacheService>>();
    }

    [Fact]
    public async Task GetOrCreateAsync_WhenNotCached_CallsFactoryAndStores()
    {
        // Arrange
        var service = new MemoryCacheService(_memoryCache, _loggerMock.Object);
        var key = "test_key_1";
        var callCount = 0;

        // Act
        var result1 = await service.GetOrCreateAsync(key, _ =>
        {
            callCount++;
            return Task.FromResult("Value1");
        });

        var result2 = await service.GetOrCreateAsync(key, _ =>
        {
            callCount++;
            return Task.FromResult("Value2");
        });

        // Assert
        Assert.Equal("Value1", result1);
        Assert.Equal("Value1", result2);
        Assert.Equal(1, callCount);
    }

    [Fact]
    public async Task GetAsync_WhenKeyExists_ReturnsValue()
    {
        // Arrange
        var service = new MemoryCacheService(_memoryCache, _loggerMock.Object);
        var key = "test_key_get";
        await service.GetOrCreateAsync(key, _ => Task.FromResult(12345));

        // Act
        var val = await service.GetAsync<int>(key);

        // Assert
        Assert.Equal(12345, val);
    }

    [Fact]
    public async Task Remove_RemovesSpecificKey()
    {
        // Arrange
        var service = new MemoryCacheService(_memoryCache, _loggerMock.Object);
        var key = "test_key_remove";
        await service.GetOrCreateAsync(key, _ => Task.FromResult("to_be_removed"));

        // Act
        service.Remove(key);
        var val = await service.GetAsync<string>(key);

        // Assert
        Assert.Null(val);
    }

    [Fact]
    public async Task RemoveByPrefix_RemovesAllMatchingPrefixKeys()
    {
        // Arrange
        var service = new MemoryCacheService(_memoryCache, _loggerMock.Object);
        await service.GetOrCreateAsync("prefix_key1", _ => Task.FromResult("val1"));
        await service.GetOrCreateAsync("prefix_key2", _ => Task.FromResult("val2"));
        await service.GetOrCreateAsync("other_key", _ => Task.FromResult("val3"));

        // Act
        service.RemoveByPrefix("prefix_");

        // Assert
        Assert.Null(await service.GetAsync<string>("prefix_key1"));
        Assert.Null(await service.GetAsync<string>("prefix_key2"));
        Assert.Equal("val3", await service.GetAsync<string>("other_key"));
    }
}
