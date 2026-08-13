using System.ComponentModel.DataAnnotations;

namespace RecipeFinderAPI.Helpers;

public class PaginationParams
{
    private const int MaxPageSize = 100;
    private const int MaxPageNumber = 1_000_000;
    private int _pageSize = 6;

    [Range(1, MaxPageNumber)]
    public int PageNumber { get; set; } = 1;

    [Range(1, MaxPageSize)]
    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = value > MaxPageSize ? MaxPageSize : value;
    }
}
