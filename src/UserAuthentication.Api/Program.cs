using Scalar.AspNetCore;
using UserAuthentication.Api.Services;
using UserAuthentication.Api.Data;
using UserAuthentication.Api.Models;
using Microsoft.AspNetCore.Identity;
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

        builder.Services.AddDbContext<UserDbContext>(options =>
            options.UseSqlServer(
                builder.Configuration.GetConnectionString("UserDatabase")));

        builder.Services.AddOpenApi();

        builder.Services.AddSingleton<IConnectionMultiplexer>(
            ConnectionMultiplexer.Connect("incident-redis:6379"));

        var app = builder.Build();

        app.UseCors("Frontend");

        // Create initial admin if the database contains no users.
        using (var scope = app.Services.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<UserDbContext>();

            if (!dbContext.Users.Any())
            {
                var admin = new User
                {
                    Username = "admin",
                    Email = "admin@example.com",
                    Role = UserRole.Admin,
                    IsActive = true
                };

                var passwordHasher = new PasswordHasher<User>();

                admin.Password = passwordHasher.HashPassword(
                    admin,
                    "Admin123!");

                dbContext.Users.Add(admin);
                dbContext.SaveChanges();
            }
        }

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