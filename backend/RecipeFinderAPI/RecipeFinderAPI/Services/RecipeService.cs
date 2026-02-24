using AutoMapper;
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
        private readonly IMapper _mapper;

        public RecipeService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<RecipeDto>> GetAllAsync(PaginationParams paginationParams)
        {
            var recipes = await _context.Recipes
                .Include(r => r.RecipeIngredients)
                .ThenInclude(ri => ri.Ingredient)
                .OrderByDescending(r => r.Id)
                .Skip((paginationParams.PageNumber - 1) * paginationParams.PageSize)
                .Take(paginationParams.PageSize)
                .ToListAsync();

            return _mapper.Map<List<RecipeDto>>(recipes);
        }

        public async Task<RecipeDto> GetByIdAsync(int id)
        {
            var recipe = await _context.Recipes
                .Include(r => r.RecipeIngredients)
                .ThenInclude(ri => ri.Ingredient)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (recipe == null)
                return null;

            return _mapper.Map<RecipeDto>(recipe);
        }

        public async Task CreateAsync(CreateRecipeDto dto)
        {
            var recipe = _mapper.Map<Recipe>(dto);
            recipe.RecipeIngredients = new List<RecipeIngredient>();

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

                var matched = recipeIngredients
                    .Where(i => userIngredients.Contains(i))
                    .ToList();

                var missing = recipeIngredients
                    .Where(i => !userIngredients.Contains(i))
                    .ToList();

                var dto = _mapper.Map<RecipeDto>(r);
                dto.MatchingScore = matched.Count;
                dto.MissingIngredients = missing;

                return dto;
            });

            result = result.Where(r => r.MatchingScore > 0);

            if (searchDto.MaxCookingTime.HasValue)
                result = result.Where(r => r.CookingTime <= searchDto.MaxCookingTime.Value);

            if (!string.IsNullOrEmpty(searchDto.Difficulty))
                result = result.Where(r =>
                    r.Difficulty.ToLower() == searchDto.Difficulty.ToLower());

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

            return _mapper.Map<RecipeDto>(recipe);
        }

        public async Task UpdateAsync(int id, CreateRecipeDto dto)
        {
            var recipe = await _context.Recipes
                .Include(r => r.RecipeIngredients)
                .ThenInclude(ri => ri.Ingredient)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (recipe == null)
                throw new Exception("Resept tapılmadı");

            _mapper.Map(dto, recipe);

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