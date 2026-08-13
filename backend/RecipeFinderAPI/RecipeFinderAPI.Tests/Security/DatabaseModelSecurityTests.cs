using Microsoft.EntityFrameworkCore;
using RecipeFinderAPI.Data;
using RecipeFinderAPI.Entities;
using Xunit;

namespace RecipeFinderAPI.Tests.Security;

public class DatabaseModelSecurityTests
{
    [Fact]
    public void UserIdentityFields_HaveUniqueDatabaseIndexes()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase("model-security")
            .Options;
        using var context = new AppDbContext(options);
        var user = context.Model.FindEntityType(typeof(User));

        Assert.NotNull(user);
        Assert.Contains(user.GetIndexes(), index =>
            index.IsUnique && index.Properties.Single().Name == nameof(User.Username));
        Assert.Contains(user.GetIndexes(), index =>
            index.IsUnique && index.Properties.Single().Name == nameof(User.Email));
        Assert.Equal(50, user.FindProperty(nameof(User.Username))?.GetMaxLength());
        Assert.Equal(150, user.FindProperty(nameof(User.Email))?.GetMaxLength());
    }

    [Fact]
    public void HardeningMigration_IsDiscoverableByEntityFramework()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=RecipeFinderMigrationTest;Trusted_Connection=True")
            .Options;
        using var context = new AppDbContext(options);

        Assert.Contains("20260813181000_HardenUserIdentityUniqueness", context.Database.GetMigrations());
        Assert.Contains("20260813182000_NormalizeLegacyUserIdentity", context.Database.GetMigrations());
    }
}
