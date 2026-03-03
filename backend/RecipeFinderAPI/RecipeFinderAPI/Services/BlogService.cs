using Microsoft.EntityFrameworkCore;
using RecipeFinderAPI.Data;
using RecipeFinderAPI.DTOs;
using RecipeFinderAPI.Entities;
using RecipeFinderAPI.Interfaces;
using System;

public class BlogService : IBlogService
{
    private readonly AppDbContext _context;

    public BlogService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<BlogDto>> GetAllAsync()
    {
        var blogs = await _context.Blogs
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();

        return blogs.Select(b => new BlogDto
        {
            Id = b.Id,
            Title = b.Title,
            Content = b.Content,
            ImageUrl = b.ImageUrl,
            CreatedAt = b.CreatedAt
        }).ToList();
    }

    public async Task<BlogDto> GetByIdAsync(int id)
    {
        var blog = await _context.Blogs.FindAsync(id);

        if (blog == null)
            return null;

        return new BlogDto
        {
            Id = blog.Id,
            Title = blog.Title,
            Content = blog.Content,
            ImageUrl = blog.ImageUrl,
            CreatedAt = blog.CreatedAt
        };
    }

    public async Task CreateAsync(CreateBlogDto dto)
    {
        var blog = new Blog
        {
            Title = dto.Title,
            Content = dto.Content,
            ImageUrl = dto.ImageUrl
        };

        _context.Blogs.Add(blog);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(int id, CreateBlogDto dto)
    {
        var blog = await _context.Blogs.FindAsync(id);

        if (blog == null)
            throw new Exception("Blog tapılmadı");

        blog.Title = dto.Title;
        blog.Content = dto.Content;
        blog.ImageUrl = dto.ImageUrl;

        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var blog = await _context.Blogs.FindAsync(id);

        if (blog == null)
            throw new Exception("Blog tapılmadı");

        _context.Blogs.Remove(blog);
        await _context.SaveChangesAsync();
    }
}