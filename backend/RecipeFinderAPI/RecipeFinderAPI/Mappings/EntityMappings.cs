using RecipeFinderAPI.DTOs;
using RecipeFinderAPI.Entities;

namespace RecipeFinderAPI.Mappings;

public static class EntityMappings
{
    public static RecipeDto ToDto(this Recipe recipe) => new()
    {
        Id = recipe.Id,
        Title = recipe.Title,
        Description = recipe.Description,
        Instructions = recipe.Instructions,
        CookingTime = recipe.CookingTime,
        Difficulty = recipe.Difficulty,
        ImageUrl = recipe.ImageUrl,
        Ingredients = recipe.RecipeIngredients.Select(item => item.Ingredient.Name).ToList()
    };

    public static Recipe ToEntity(this CreateRecipeDto dto)
    {
        var entity = new Recipe();
        entity.Apply(dto);
        return entity;
    }

    public static void Apply(this Recipe recipe, CreateRecipeDto dto)
    {
        recipe.Title = dto.Title.Trim();
        recipe.Description = dto.Description.Trim();
        recipe.Instructions = dto.Instructions.Trim();
        recipe.CookingTime = dto.CookingTime;
        recipe.Difficulty = dto.Difficulty.Trim();
        recipe.ImageUrl = dto.ImageUrl.Trim();
    }

    public static Feedback ToEntity(this CreateFeedbackDto dto) => new()
    {
        FullName = dto.FullName.Trim(),
        Email = dto.Email.Trim().ToLowerInvariant(),
        Message = dto.Message.Trim()
    };

    public static FeedbackDto ToDto(this Feedback feedback) => new()
    {
        Id = feedback.Id,
        FullName = feedback.FullName,
        Email = feedback.Email,
        Message = feedback.Message
    };
}
