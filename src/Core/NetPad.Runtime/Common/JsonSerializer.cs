using System.Text.Json;
using System.Text.Json.Serialization;

namespace NetPad.Common;

/// <summary>
/// Provides a centralized JSON serializer for use across the entire application.
/// This serializer ensures consistent JSON formatting and behavior throughout the codebase.
/// Use this serializer by default unless there is a specific reason to use a different one.
/// </summary>
public static class JsonSerializer
{
    static JsonSerializer()
    {
        DefaultOptions = Configure(new JsonSerializerOptions());
    }

    public static JsonSerializerOptions DefaultOptions { get; }

    public static JsonSerializerOptions Configure(JsonSerializerOptions options)
    {
        options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.Converters.Add(new JsonStringEnumConverter());
        return options;
    }

    public static string Serialize(object? value, bool indented = false)
    {
        var options = indented ? Configure(new JsonSerializerOptions { WriteIndented = true }) : DefaultOptions;
        return System.Text.Json.JsonSerializer.Serialize(value, options);
    }

    public static string Serialize(object? value, Type type, bool indented = false)
    {
        var options = indented ? Configure(new JsonSerializerOptions { WriteIndented = true }) : DefaultOptions;
        return System.Text.Json.JsonSerializer.Serialize(value, type, options);
    }

    public static T? Deserialize<T>(string json)
    {
        return System.Text.Json.JsonSerializer.Deserialize<T>(json, DefaultOptions);
    }

    public static T? Deserialize<T>(string json, JsonSerializerOptions options)
    {
        Configure(options);
        return System.Text.Json.JsonSerializer.Deserialize<T>(json, options);
    }
}
