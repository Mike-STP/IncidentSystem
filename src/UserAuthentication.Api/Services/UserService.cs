using Microsoft.EntityFrameworkCore;
using UserAuthentication.Api.Data;
using UserAuthentication.Api.Models;

namespace UserAuthentication.Api.Services;

public class UserService
{
    private readonly UserDbContext context;

    public UserService(UserDbContext context)
    {
        this.context = context;
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
        user.Password = updatedUser.Password;
        user.Role = updatedUser.Role;

        context.SaveChanges();

        return user;
    }
}