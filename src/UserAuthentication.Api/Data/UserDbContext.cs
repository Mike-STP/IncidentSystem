using Microsoft.EntityFrameworkCore;
using UserAuthentication.Api.Models;

namespace UserAuthentication.Api.Data;

public class UserDbContext : DbContext
{
    public UserDbContext(DbContextOptions<UserDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
}