using Microsoft.EntityFrameworkCore;
using RecipeFinderAPI.Data;
using RecipeFinderAPI.DTOs;
using RecipeFinderAPI.Entities;
using RecipeFinderAPI.Exceptions;
using RecipeFinderAPI.Helpers;
using RecipeFinderAPI.Interfaces;
using RecipeFinderAPI.Mappings;

namespace RecipeFinderAPI.Services;

public class RecipeService : IRecipeService
{
    private readonly AppDbContext _context;
    public RecipeService(AppDbContext context) => _context = context;

    public async Task<List<RecipeDto>> GetAllAsync(PaginationParams paginationParams)
    {
        var recipes = await QueryRecipes()
            .OrderByDescending(recipe => recipe.Id)
            .Skip((paginationParams.PageNumber - 1) * paginationParams.PageSize)
            .Take(paginationParams.PageSize)
            .ToListAsync();
        return recipes.Select(recipe => recipe.ToDto()).ToList();
    }

    public async Task<RecipeDto> GetByIdAsync(int id)
    {
        var recipe = await QueryRecipes().FirstOrDefaultAsync(item => item.Id == id)
            ?? throw new NotFoundException("Resept tapılmadı");
        return recipe.ToDto();
    }

    public async Task CreateAsync(CreateRecipeDto dto)
    {
        var recipe = dto.ToEntity();
        recipe.RecipeIngredients = [];
        await AddIngredients(recipe, dto.Ingredients);
        _context.Recipes.Add(recipe);
        await _context.SaveChangesAsync();
    }

    public async Task<List<RecipeDto>> SearchAsync(RecipeSearchDto searchDto)
    {
        var recipes = await QueryRecipes().ToListAsync();
        var requested = searchDto.Ingredients.Select(item => item.Trim()).ToHashSet(StringComparer.OrdinalIgnoreCase);
        var result = recipes.Select(recipe =>
        {
            var names = recipe.RecipeIngredients.Select(item => item.Ingredient.Name).ToList();
            var dto = recipe.ToDto();
            dto.MatchingScore = names.Count(requested.Contains);
            dto.MissingIngredients = names.Where(name => !requested.Contains(name)).ToList();
            return dto;
        }).Where(dto => requested.Count == 0 || dto.MatchingScore > 0);

        if (searchDto.MaxCookingTime.HasValue)
            result = result.Where(dto => dto.CookingTime <= searchDto.MaxCookingTime.Value);
        if (!string.IsNullOrWhiteSpace(searchDto.Difficulty))
            result = result.Where(dto => string.Equals(dto.Difficulty, searchDto.Difficulty.Trim(), StringComparison.OrdinalIgnoreCase));

        return (searchDto.SortBy?.ToLowerInvariant() switch
        {
            "newest" => result.OrderByDescending(dto => dto.Id),
            "az" => result.OrderBy(dto => dto.Title),
            _ => result.OrderByDescending(dto => dto.MatchingScore)
        }).ToList();
    }

    public async Task<RecipeDto?> GetRandomAsync()
    {
        var recipes = await QueryRecipes().ToListAsync();
        return recipes.Count == 0 ? null : recipes[Random.Shared.Next(recipes.Count)].ToDto();
    }

    public async Task UpdateAsync(int id, CreateRecipeDto dto)
    {
        var recipe = await QueryRecipes().FirstOrDefaultAsync(item => item.Id == id)
            ?? throw new NotFoundException("Resept tapılmadı");
        recipe.Apply(dto);
        recipe.RecipeIngredients.Clear();
        await AddIngredients(recipe, dto.Ingredients);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var recipe = await _context.Recipes.FindAsync(id)
            ?? throw new NotFoundException("Resept tapılmadı");
        _context.Recipes.Remove(recipe);
        await _context.SaveChangesAsync();
    }

    private IQueryable<Recipe> QueryRecipes() => _context.Recipes
        .Include(recipe => recipe.RecipeIngredients)
        .ThenInclude(item => item.Ingredient);

    private async Task AddIngredients(Recipe recipe, IEnumerable<string> ingredientNames)
    {
        foreach (var name in ingredientNames.Select(item => item.Trim()).Distinct(StringComparer.OrdinalIgnoreCase))
        {
            var ingredient = await _context.Ingredients.FirstOrDefaultAsync(item => item.Name == name);
            if (ingredient is null)
            {
                ingredient = new Ingredient { Name = name };
                _context.Ingredients.Add(ingredient);
            }
            recipe.RecipeIngredients.Add(new RecipeIngredient { Recipe = recipe, Ingredient = ingredient });
        }
    }
}
