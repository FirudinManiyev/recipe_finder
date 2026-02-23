using Microsoft.EntityFrameworkCore;
using RecipeFinderAPI.Data;
using RecipeFinderAPI.DTOs;
using RecipeFinderAPI.Entities;
using RecipeFinderAPI.Helpers;
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

        public async Task<List<RecipeDto>> GetAllAsync(PaginationParams paginationParams)
        {
            var query = _context.Recipes
                .Include(r => r.RecipeIngredients)
                .ThenInclude(ri => ri.Ingredient)
                .AsQueryable();

            var recipes = await query
                .OrderByDescending(r => r.Id)
                .Skip((paginationParams.PageNumber - 1) * paginationParams.PageSize)
                .Take(paginationParams.PageSize)
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
                MatchingScore = 0,
                MissingIngredients = new List<string>()
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

        public async Task<List<RecipeDto>> SearchAsync(RecipeSearchDto searchDto)
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

                var userIngredients = searchDto.Ingredients
                    .Select(i => i.ToLower())
                    .ToList();

                var matchedIngredients = recipeIngredients
                    .Where(i => userIngredients.Contains(i))
                    .ToList();

                var missingIngredients = recipeIngredients
                    .Where(i => !userIngredients.Contains(i))
                    .ToList();

                return new RecipeDto
                {
                    Id = r.Id,
                    Title = r.Title,
                    Description = r.Description,
                    CookingTime = r.CookingTime,
                    Difficulty = r.Difficulty,
                    ImageUrl = r.ImageUrl,
                    Ingredients = recipeIngredients,
                    MatchingScore = matchedIngredients.Count,
                    MissingIngredients = missingIngredients
                };
            });

            // Ingredient match filter
            result = result.Where(r => r.MatchingScore > 0);

            // Cooking time filter
            if (searchDto.MaxCookingTime.HasValue)
                result = result.Where(r => r.CookingTime <= searchDto.MaxCookingTime.Value);

            // Difficulty filter
            if (!string.IsNullOrEmpty(searchDto.Difficulty))
                result = result.Where(r =>
                    r.Difficulty.ToLower() == searchDto.Difficulty.ToLower());

            // Sorting
            result = searchDto.SortBy switch
            {
                "mostmatched" => result.OrderByDescending(r => r.MatchingScore),
                "newest" => result.OrderByDescending(r => r.Id),
                "az" => result.OrderBy(r => r.Title),
                _ => result.OrderByDescending(r => r.MatchingScore)
            };

            return result.ToList();
        }

        public async Task<RecipeDto> GetRandomAsync()
        {
            var recipes = await _context.Recipes
                .Include(r => r.RecipeIngredients)
                .ThenInclude(ri => ri.Ingredient)
                .ToListAsync();

            if (!recipes.Any())
                return null;

            var random = new Random();
            var recipe = recipes[random.Next(recipes.Count)];

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
                MatchingScore = 0,
                MissingIngredients = new List<string>()
            };
        }

        public async Task UpdateAsync(int id, CreateRecipeDto dto)
        {
            var recipe = await _context.Recipes
                .Include(r => r.RecipeIngredients)
                .ThenInclude(ri => ri.Ingredient)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (recipe == null)
                throw new Exception("Resept tapılmadı");

            recipe.Title = dto.Title;
            recipe.Description = dto.Description;
            recipe.Instructions = dto.Instructions;
            recipe.CookingTime = dto.CookingTime;
            recipe.Difficulty = dto.Difficulty;
            recipe.ImageUrl = dto.ImageUrl;

            // Köhnə ingredientləri silirik
            recipe.RecipeIngredients.Clear();

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
                    Recipe = recipe,
                    Ingredient = ingredient
                });
            }

            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var recipe = await _context.Recipes.FindAsync(id);

            if (recipe == null)
                throw new Exception("Resept tapılmadı");

            _context.Recipes.Remove(recipe);
            await _context.SaveChangesAsync();
        }
    }
}