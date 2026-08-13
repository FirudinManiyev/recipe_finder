using RecipeFinderAPI.DTOs;
using RecipeFinderAPI.Entities;
using RecipeFinderAPI.Mappings;
using Xunit;

namespace RecipeFinderAPI.Tests.Mappings;

public class EntityMappingsTests
{
    [Fact]
    public void RecipeMapping_PreservesAllPublicFieldsAndIngredients()
    {
        var recipe = new Recipe
        {
            Id = 7, Title = "Dolma", Description = "Təsvir", Instructions = "Hazırla", CookingTime = 90,
            Difficulty = "Orta", ImageUrl = "/images/dolma.jpg",
            RecipeIngredients = [new RecipeIngredient { Ingredient = new Ingredient { Name = "Yarpaq" } }]
        };

        var dto = recipe.ToDto();

        Assert.Equal((7, "Dolma", "Təsvir", "Hazırla", 90, "Orta", "/images/dolma.jpg"), (dto.Id, dto.Title, dto.Description, dto.Instructions, dto.CookingTime, dto.Difficulty, dto.ImageUrl));
        Assert.Equal(["Yarpaq"], dto.Ingredients);
    }

    [Fact]
    public void RecipeApply_UpdatesEditableFields()
    {
        var entity = new Recipe();
        var input = new CreateRecipeDto { Title = "Plov", Description = "Uzun təsvir", Instructions = "Düyünü bişirin", CookingTime = 60, Difficulty = "Orta", ImageUrl = "/images/plov.jpg", Ingredients = ["Düyü"] };

        entity.Apply(input);

        Assert.Equal(("Plov", "Uzun təsvir", "Düyünü bişirin", 60, "Orta", "/images/plov.jpg"), (entity.Title, entity.Description, entity.Instructions, entity.CookingTime, entity.Difficulty, entity.ImageUrl));
    }
}
