using System.Net;
using RecipeFinderAPI.Exceptions;

namespace RecipeFinderAPI.Middleware;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (NotFoundException exception)
        {
            await WriteError(context, HttpStatusCode.NotFound, exception.Message);
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "Unhandled API error. TraceId: {TraceId}", context.TraceIdentifier);
            await WriteError(
                context,
                HttpStatusCode.InternalServerError,
                "Gözlənilməz xəta baş verdi. Bir qədər sonra yenidən cəhd edin.");
        }
    }

    private static Task WriteError(HttpContext context, HttpStatusCode status, string message)
    {
        context.Response.StatusCode = (int)status;
        context.Response.ContentType = "application/json";
        return context.Response.WriteAsJsonAsync(new
        {
            statusCode = context.Response.StatusCode,
            message,
            traceId = context.TraceIdentifier
        });
    }
}
