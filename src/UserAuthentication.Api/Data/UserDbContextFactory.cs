using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace UserAuthentication.Api.Data;

public class UserDbContextFactory : IDesignTimeDbContextFactory<UserDbContext>
{
    public UserDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<UserDbContext>();

        optionsBuilder.UseSqlServer(
            "Server=localhost,1434;Database=UserDatabase;User Id=sa;Password=Example123!;TrustServerCertificate=True");

        return new UserDbContext(optionsBuilder.Options);
    }
}