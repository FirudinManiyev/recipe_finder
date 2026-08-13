using Microsoft.AspNetCore.Authorization;
using RecipeFinderAPI.Controllers;
using Xunit;

namespace RecipeFinderAPI.Tests.Auth;

public class AuthorizationTests
{
    [Theory]
    [InlineData(nameof(RecipesController.Create))]
    [InlineData(nameof(RecipesController.Update))]
    [InlineData(nameof(RecipesController.Delete))]
    public void RecipeMutations_RequireAdminRole(string actionName)
    {
        var method = typeof(RecipesController).GetMethod(actionName)!;
        var attribute = Assert.Single(method.GetCustomAttributes(typeof(AuthorizeAttribute), true).Cast<AuthorizeAttribute>());

        Assert.Equal("Admin", attribute.Roles);
    }
}
