using System.ComponentModel.DataAnnotations;
using RecipeFinderAPI.DTOs;
using RecipeFinderAPI.Helpers;
using Xunit;

namespace RecipeFinderAPI.Tests.Validation;

public class DtoValidationTests
{
    [Fact]
    public void Register_RejectsInvalidIdentityAndWeakPassword()
    {
        var dto = new RegisterDto
        {
            Username = "ab",
            Email = "not-an-email",
            Password = "123456"
        };

        Assert.False(IsValid(dto));
    }

    [Fact]
    public void Login_RejectsWhitespaceOnlyCredentials()
    {
        var dto = new LoginDto { Username = "   ", Password = "   " };

        Assert.False(IsValid(dto));
    }

    [Fact]
    public void Feedback_RejectsShortOrOversizedInput()
    {
        var shortMessage = new CreateFeedbackDto
        {
            FullName = "   ",
            Email = "user@example.com",
            Message = "qısa"
        };
        var oversizedMessage = new CreateFeedbackDto
        {
            FullName = "Valid User",
            Email = "user@example.com",
            Message = new string('a', 1001)
        };

        Assert.False(IsValid(shortMessage));
        Assert.False(IsValid(oversizedMessage));
    }

    [Theory]
    [InlineData("javascript:alert(1)")]
    [InlineData("data:text/html;base64,PHNjcmlwdD4=")]
    [InlineData("//attacker.example/image.jpg")]
    public void Blog_RejectsUnsafeImageUrls(string imageUrl)
    {
        var dto = new CreateBlogDto
        {
            Title = "Təhlükəsiz başlıq",
            Content = "Bu, kifayət qədər uzun və təhlükəsiz blog məzmunudur.",
            ImageUrl = imageUrl
        };

        Assert.False(IsValid(dto));
    }

    [Fact]
    public void Recipe_RejectsDuplicateIngredientsAndUnknownDifficulty()
    {
        var dto = new CreateRecipeDto
        {
            Title = "Pomidor yeməyi",
            Description = "Sadə və dadlı resept təsviri.",
            Instructions = "Pomidorları doğrayın və tavada bişirin.",
            CookingTime = 30,
            Difficulty = "Impossible",
            ImageUrl = "/images/tomato.jpg",
            Ingredients = ["Pomidor", " pomidor "]
        };

        Assert.False(IsValid(dto));
    }

    [Theory]
    [InlineData("invalid", null)]
    [InlineData(null, "oldest-first")]
    public void Search_RejectsUnknownAllowlists(string? difficulty, string? sortBy)
    {
        var dto = new RecipeSearchDto
        {
            Ingredients = ["Pomidor"],
            Difficulty = difficulty,
            SortBy = sortBy
        };

        Assert.False(IsValid(dto));
    }

    [Theory]
    [InlineData(0, 6)]
    [InlineData(1, 0)]
    public void Pagination_RejectsNonPositiveValues(int pageNumber, int pageSize)
    {
        var pagination = new PaginationParams
        {
            PageNumber = pageNumber,
            PageSize = pageSize
        };

        Assert.False(IsValid(pagination));
    }

    [Fact]
    public void RecipePayloads_RejectNullCollectionsWithoutThrowing()
    {
        var create = new CreateRecipeDto { Ingredients = null!, Difficulty = null! };
        var search = new RecipeSearchDto { Ingredients = null! };

        Assert.False(IsValid(create));
        Assert.False(IsValid(search));
    }

    [Fact]
    public void Pagination_RejectsPageNumbersThatCouldOverflowSkipCalculation()
    {
        var pagination = new PaginationParams { PageNumber = int.MaxValue, PageSize = 100 };

        Assert.False(IsValid(pagination));
    }

    private static bool IsValid(object value)
    {
        var context = new ValidationContext(value);
        return Validator.TryValidateObject(value, context, [], validateAllProperties: true);
    }
}
