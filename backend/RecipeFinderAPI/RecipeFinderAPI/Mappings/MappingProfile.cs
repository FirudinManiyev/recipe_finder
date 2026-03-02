using AutoMapper;
using RecipeFinderAPI.DTOs;
using RecipeFinderAPI.Entities;

namespace RecipeFinderAPI.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Recipe, RecipeDto>()
                .ForMember(dest => dest.Ingredients,
                    opt => opt.MapFrom(src =>
                        src.RecipeIngredients
                            .Select(ri => ri.Ingredient.Name)));

            CreateMap<CreateRecipeDto, Recipe>();

            CreateMap<Feedback, CreateFeedbackDto>();

            CreateMap<CreateFeedbackDto, Feedback>();

            CreateMap<Blog, BlogDto>().ReverseMap();
        }
    }
}