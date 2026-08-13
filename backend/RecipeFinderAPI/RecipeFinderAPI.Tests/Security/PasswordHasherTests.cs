using RecipeFinderAPI.Helpers;
using System.Security.Cryptography;
using System.Text;
using Xunit;

namespace RecipeFinderAPI.Tests.Security;

public class PasswordHasherTests
{
    [Fact]
    public void Hash_CreatesVersionedSaltedRecord()
    {
        const string password = "StrongPass123!";

        var first = PasswordHasher.Hash(password);
        var second = PasswordHasher.Hash(password);

        Assert.StartsWith("PBKDF2$", first);
        Assert.NotEqual(first, second);
    }

    [Fact]
    public void Verify_AcceptsCorrectPasswordAndRejectsIncorrectPassword()
    {
        var hash = PasswordHasher.Hash("StrongPass123!");

        Assert.True(PasswordHasher.Verify("StrongPass123!", hash));
        Assert.False(PasswordHasher.Verify("WrongPass123!", hash));
    }

    [Fact]
    public void Verify_AcceptsLegacySha256RecordForMigration()
    {
        var legacyBytes = SHA256.HashData(Encoding.UTF8.GetBytes("LegacyPass123!"));
        var legacyHash = Convert.ToBase64String(legacyBytes);

        Assert.True(PasswordHasher.IsLegacyHash(legacyHash));
        Assert.True(PasswordHasher.Verify("LegacyPass123!", legacyHash));
        Assert.False(PasswordHasher.Verify("WrongPass123!", legacyHash));
    }

    [Theory]
    [InlineData("")]
    [InlineData("PBKDF2$broken")]
    [InlineData("PBKDF2$0$not-base64$not-base64")]
    public void Verify_ReturnsFalseForMalformedRecords(string record)
    {
        Assert.False(PasswordHasher.Verify("Password123!", record));
    }
}
