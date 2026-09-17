using Scalar.AspNetCore;
using IncidentSystem.Api.Services;
using IncidentSystem.Api.Data;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;

namespace IncidentSystem.Api;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddControllers();

        builder.Services.AddCors(options =>
        {
            options.AddPolicy("Frontend", policy =>
            {
                policy
                    .WithOrigins("http://localhost:5173")
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
        });

        builder.Services.AddScoped<IncidentService>();

        builder.Services.AddDbContext<IncidentDbContext>(options =>
            options.UseSqlServer(
                builder.Configuration.GetConnectionString("IncidentDatabase")));

        builder.Services.AddSingleton<IConnectionMultiplexer>(
            ConnectionMultiplexer.Connect("localhost:6379"));

        builder.Services.AddScoped<SessionService>();

        builder.Services.AddOpenApi();

        var app = builder.Build();

        app.UseCors("Frontend");

        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
            app.MapScalarApiReference();
        }

        app.UseHttpsRedirection();
        app.UseAuthorization();
        app.MapControllers();

        app.Run();
    }
}