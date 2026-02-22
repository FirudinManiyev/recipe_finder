using Microsoft.EntityFrameworkCore;
using RecipeFinderAPI.Data;
using RecipeFinderAPI.DTOs;
using RecipeFinderAPI.Entities;
using RecipeFinderAPI.Interfaces;

namespace RecipeFinderAPI.Services
{
    public class RecipeService : IRecipeService
    {
        private readonly AppDbContext _context;

        public RecipeService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<RecipeDto>> GetAllAsync()
        {
            var recipes = await _context.Recipes
                .Include(r => r.RecipeIngredients)
                .ThenInclude(ri => ri.Ingredient)
                .ToListAsync();

            return recipes.Select(r => new RecipeDto
            {
                Id = r.Id,
                Title = r.Title,
                Description = r.Description,
                CookingTime = r.CookingTime,
                Difficulty = r.Difficulty,
                ImageUrl = r.ImageUrl,
                Ingredients = r.RecipeIngredients
                    .Select(ri => ri.Ingredient.Name)
                    .ToList(),
                MatchingScore = 0
            }).ToList();
        }

        public async Task<RecipeDto> GetByIdAsync(int id)
        {
            var recipe = await _context.Recipes
                .Include(r => r.RecipeIngredients)
                .ThenInclude(ri => ri.Ingredient)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (recipe == null)
                return null;

            return new RecipeDto
            {
                Id = recipe.Id,
                Title = recipe.Title,
                Description = recipe.Description,
                CookingTime = recipe.CookingTime,
                Difficulty = recipe.Difficulty,
                ImageUrl = recipe.ImageUrl,
                Ingredients = recipe.RecipeIngredients
                    .Select(ri => ri.Ingredient.Name)
                    .ToList(),
                MatchingScore = 0
            };
        }

        public async Task CreateAsync(CreateRecipeDto dto)
        {
            var recipe = new Recipe
            {
                Title = dto.Title,
                Description = dto.Description,
                Instructions = dto.Instructions,
                CookingTime = dto.CookingTime,
                Difficulty = dto.Difficulty,
                ImageUrl = dto.ImageUrl,
                RecipeIngredients = new List<RecipeIngredient>()
            };

            foreach (var ingredientName in dto.Ingredients)
            {
                var ingredient = await _context.Ingredients
                    .FirstOrDefaultAsync(i => i.Name == ingredientName);

                if (ingredient == null)
                {
                    ingredient = new Ingredient { Name = ingredientName };
                    _context.Ingredients.Add(ingredient);
                }

                recipe.RecipeIngredients.Add(new RecipeIngredient
                {
                    Ingredient = ingredient
                });
            }

            _context.Recipes.Add(recipe);
            await _context.SaveChangesAsync();
        }

        public async Task<List<RecipeDto>> SearchByIngredientsAsync(List<string> ingredients)
        {
            var recipes = await _context.Recipes
                .Include(r => r.RecipeIngredients)
                .ThenInclude(ri => ri.Ingredient)
                .ToListAsync();

            var result = recipes.Select(r =>
            {
                var recipeIngredients = r.RecipeIngredients
                    .Select(ri => ri.Ingredient.Name.ToLower())
                    .ToList();

                var matched = ingredients
                    .Count(i => recipeIngredients.Contains(i.ToLower()));

                return new RecipeDto
                {
                    Id = r.Id,
                    Title = r.Title,
                    Description = r.Description,
                    CookingTime = r.CookingTime,
                    Difficulty = r.Difficulty,
                    ImageUrl = r.ImageUrl,
                    Ingredients = recipeIngredients,
                    MatchingScore = matched
                };
            })
            .Where(r => r.MatchingScore > 0)
            .OrderByDescending(r => r.MatchingScore)
            .ToList();

            return result;
        }
    }
}