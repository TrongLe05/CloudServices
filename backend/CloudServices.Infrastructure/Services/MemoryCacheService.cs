using System.Collections.Concurrent;
using CloudServices.Application.Common.Interfaces;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace CloudServices.Infrastructure.Services;

public class MemoryCacheService : ICacheService
{
    private readonly IMemoryCache _memoryCache;
    private readonly ILogger<MemoryCacheService> _logger;
    private static readonly ConcurrentDictionary<string, byte> _allKeys = new();

    public MemoryCacheService(IMemoryCache memoryCache, ILogger<MemoryCacheService> logger)
    {
        _memoryCache = memoryCache;
        _logger = logger;
    }

    public Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default)
    {
        if (_memoryCache.TryGetValue(key, out T? value))
        {
            return Task.FromResult(value);
        }
        return Task.FromResult(default(T));
    }

    public async Task<T> GetOrCreateAsync<T>(
        string key,
        Func<CancellationToken, Task<T>> factory,
        TimeSpan? expiration = null,
        CancellationToken cancellationToken = default)
    {
        if (_memoryCache.TryGetValue(key, out T? cachedValue) && cachedValue is not null)
        {
            return cachedValue;
        }

        var result = await factory(cancellationToken);

        if (result is not null)
        {
            var options = new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = expiration ?? TimeSpan.FromMinutes(2),
                SlidingExpiration = TimeSpan.FromSeconds(30)
            };

            options.RegisterPostEvictionCallback((k, v, r, s) =>
            {
                _allKeys.TryRemove(k.ToString() ?? string.Empty, out _);
            });

            _memoryCache.Set(key, result, options);
            _allKeys.TryAdd(key, 0);
        }

        return result;
    }

    public void Remove(string key)
    {
        _memoryCache.Remove(key);
        _allKeys.TryRemove(key, out _);
    }

    public void RemoveByPrefix(string prefix)
    {
        var keysToRemove = _allKeys.Keys.Where(k => k.StartsWith(prefix, StringComparison.OrdinalIgnoreCase)).ToList();
        foreach (var key in keysToRemove)
        {
            _memoryCache.Remove(key);
            _allKeys.TryRemove(key, out _);
        }
        _logger.LogInformation("Đã xóa {Count} cache keys có tiền tố: {Prefix}", keysToRemove.Count, prefix);
    }
}
