using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace IncidentSystem.Api.Data;

public class IncidentDbContextFactory : IDesignTimeDbContextFactory<IncidentDbContext>
{
    public IncidentDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<IncidentDbContext>();

        optionsBuilder.UseSqlServer(
            "Server=localhost,1433;Database=IncidentDatabase;User Id=sa;Password=Example123!;TrustServerCertificate=True");

        return new IncidentDbContext(optionsBuilder.Options);
    }
}
