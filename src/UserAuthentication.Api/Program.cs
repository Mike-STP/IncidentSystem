using Scalar.AspNetCore;
using UserAuthentication.Api.Services;
using UserAuthentication.Api.Data;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;

namespace UserAuthentication.Api;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.

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

        builder.Services.AddScoped<UserService>();
        builder.Services.AddScoped<SessionService>();
        builder.Services.AddDbContext<UserDbContext>(options => options.UseSqlServer(
        builder.Configuration.GetConnectionString("UserDatabase")));
        // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
        builder.Services.AddOpenApi();
        builder.Services.AddSingleton<IConnectionMultiplexer>( ConnectionMultiplexer.Connect("localhost:6379"));

        var app = builder.Build();
        app.UseCors("Frontend");

        // Configure the HTTP request pipeline.
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
