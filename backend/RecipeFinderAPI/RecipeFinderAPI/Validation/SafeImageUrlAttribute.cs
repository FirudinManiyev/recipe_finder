using System.ComponentModel.DataAnnotations;

namespace RecipeFinderAPI.Validation;

[AttributeUsage(AttributeTargets.Property | AttributeTargets.Parameter)]
public sealed class SafeImageUrlAttribute : ValidationAttribute
{
    public SafeImageUrlAttribute()
        : base("Şəkil ünvanı təhlükəsiz deyil.")
    {
    }

    public override bool IsValid(object? value)
    {
        if (value is not string raw || string.IsNullOrWhiteSpace(raw))
            return false;

        var url = raw.Trim();
        if (url.StartsWith("//", StringComparison.Ordinal) || url.Contains('\\'))
            return false;

        if (url.StartsWith('/'))
            return !url.Contains("..", StringComparison.Ordinal);

        if (!Uri.TryCreate(url, UriKind.Absolute, out var uri))
            return !url.Contains(':') && !url.Contains("..", StringComparison.Ordinal);

        return uri.Scheme == Uri.UriSchemeHttps;
    }
}
