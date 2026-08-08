using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Text.Json;

namespace CloudServices.Application.Common.Workflow;

public class WorkflowContext
{
    private readonly ConcurrentDictionary<string, object> _data;

    public WorkflowContext()
    {
        _data = new ConcurrentDictionary<string, object>();
    }

    public WorkflowContext(IDictionary<string, object> initialData)
    {
        _data = new ConcurrentDictionary<string, object>(initialData);
    }

    public void Set<T>(string key, T value)
    {
        if (value == null)
        {
            _data.TryRemove(key, out _);
        }
        else
        {
            _data[key] = value;
        }
    }

    public T? Get<T>(string key)
    {
        if (!_data.TryGetValue(key, out var value))
        {
            return default;
        }

        if (value is T typedValue)
        {
            return typedValue;
        }

        if (value is JsonElement element)
        {
            return DeserializeJsonElement<T>(element);
        }

        try
        {
            return (T)Convert.ChangeType(value, typeof(T));
        }
        catch
        {
            return default;
        }
    }

    public bool TryGet<T>(string key, out T? value)
    {
        if (!_data.TryGetValue(key, out var rawValue))
        {
            value = default;
            return false;
        }

        if (rawValue is T typedValue)
        {
            value = typedValue;
            return true;
        }

        if (rawValue is JsonElement element)
        {
            try
            {
                value = DeserializeJsonElement<T>(element);
                return value != null;
            }
            catch
            {
                value = default;
                return false;
            }
        }

        try
        {
            value = (T)Convert.ChangeType(rawValue, typeof(T));
            return true;
        }
        catch
        {
            value = default;
            return false;
        }
    }

    public bool Has(string key) => _data.ContainsKey(key);

    public void Remove(string key) => _data.TryRemove(key, out _);

    public IDictionary<string, object> GetData() => new Dictionary<string, object>(_data);

    private T? DeserializeJsonElement<T>(JsonElement element)
    {
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        return JsonSerializer.Deserialize<T>(element.GetRawText(), options);
    }
}
