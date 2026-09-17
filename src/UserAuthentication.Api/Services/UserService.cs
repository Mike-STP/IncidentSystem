using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using UserAuthentication.Api.Data;
using UserAuthentication.Api.Models;

namespace UserAuthentication.Api.Services;

public class UserService
{
    private readonly UserDbContext context;
    private readonly PasswordHasher<User> passwordHasher;

    public UserService(UserDbContext context)
    {
        this.context = context;
        passwordHasher = new PasswordHasher<User>();
    }

    public List<User> GetAll()
    {
        return context.Users.ToList();
    }

    public User? GetById(int id)
    {
        return context.Users.FirstOrDefault(u => u.Id == id);
    }

    public User Create(User user)
    {
        user.Password = passwordHasher.HashPassword(user, user.Password);

        context.Users.Add(user);
        context.SaveChanges();

        return user;
    }

    public User? Update(int id, User updatedUser)
    {
        User? user = GetById(id);

        if (user == null)
        {
            return null;
        }

        user.Username = updatedUser.Username;
        user.Email = updatedUser.Email;
        user.Password = passwordHasher.HashPassword(user, updatedUser.Password);
        user.Role = updatedUser.Role;

        context.SaveChanges();

        return user;
    }

    public User? Login(string username, string password)
    {
        User? user = context.Users.FirstOrDefault(u => u.Username == username);

        if (user == null)
        {
            return null;
        }

        PasswordVerificationResult result =
            passwordHasher.VerifyHashedPassword(
                user,
                user.Password,
                password);

        if (result == PasswordVerificationResult.Success)
        {
            return user;
        }

        return null;
    }
}