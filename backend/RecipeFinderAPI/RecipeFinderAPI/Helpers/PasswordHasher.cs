using System.Security.Cryptography;
using System.Text;

namespace RecipeFinderAPI.Helpers;

public static class PasswordHasher
{
    private const string Algorithm = "PBKDF2";
    private const int Iterations = 210_000;
    private const int SaltSize = 16;
    private const int SubkeySize = 32;

    public static string Hash(string password)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(password);

        var salt = RandomNumberGenerator.GetBytes(SaltSize);
        var subkey = Rfc2898DeriveBytes.Pbkdf2(
            password,
            salt,
            Iterations,
            HashAlgorithmName.SHA256,
            SubkeySize);

        return string.Join(
            '$',
            Algorithm,
            Iterations,
            Convert.ToBase64String(salt),
            Convert.ToBase64String(subkey));
    }

    public static bool Verify(string password, string storedHash)
    {
        if (string.IsNullOrEmpty(password) || string.IsNullOrWhiteSpace(storedHash))
            return false;

        if (IsLegacyHash(storedHash))
        {
            var expected = SHA256.HashData(Encoding.UTF8.GetBytes(password));
            var actual = Convert.FromBase64String(storedHash);
            return CryptographicOperations.FixedTimeEquals(expected, actual);
        }

        var parts = storedHash.Split('$');
        if (parts.Length != 4 || !string.Equals(parts[0], Algorithm, StringComparison.Ordinal))
            return false;

        try
        {
            if (!int.TryParse(parts[1], out var iterations) || iterations < 100_000)
                return false;

            var salt = Convert.FromBase64String(parts[2]);
            var actual = Convert.FromBase64String(parts[3]);
            if (salt.Length < SaltSize || actual.Length != SubkeySize)
                return false;

            var expected = Rfc2898DeriveBytes.Pbkdf2(
                password,
                salt,
                iterations,
                HashAlgorithmName.SHA256,
                actual.Length);

            return CryptographicOperations.FixedTimeEquals(expected, actual);
        }
        catch (FormatException)
        {
            return false;
        }
        catch (CryptographicException)
        {
            return false;
        }
    }

    public static bool IsLegacyHash(string storedHash)
    {
        if (string.IsNullOrWhiteSpace(storedHash) || storedHash.StartsWith($"{Algorithm}$", StringComparison.Ordinal))
            return false;

        try
        {
            return Convert.FromBase64String(storedHash).Length == SHA256.HashSizeInBytes;
        }
        catch (FormatException)
        {
            return false;
        }
    }
}
