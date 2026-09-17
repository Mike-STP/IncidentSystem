using IncidentSystem.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace IncidentSystem.Api.Data;

public class IncidentDbContext : DbContext
{
    public IncidentDbContext(DbContextOptions<IncidentDbContext> options)
        : base(options)
    {
    }

    public DbSet<Incident> Incidents { get; set; }
}