using UserAuthentication.Api.Models;

namespace UserAuthentication.Api.Services;

public class UserService
{
    private readonly List<User> users = new();

    public List<User> GetAll()
    {
        return users;
    }

    public User? GetById(int id)
    {
        return users.FirstOrDefault(u => u.Id == id);
    }

    public User Create(User user)
    {
        user.Id = users.Count + 1;

        users.Add(user);

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

        return user;
    }
}