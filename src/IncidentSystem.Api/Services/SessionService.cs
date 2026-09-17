using StackExchange.Redis;

namespace IncidentSystem.Api.Services;

public class SessionService
{
    private readonly IDatabase database;

    public SessionService(IConnectionMultiplexer redis)
    {
        database = redis.GetDatabase();
    }

    public bool IsAdmin(string? sessionId)
    {
        if (string.IsNullOrEmpty(sessionId))
        {
            return false;
        }

        string key = $"session:{sessionId}";

        RedisValue role = database.HashGet(key, "Role");

        return role.ToString().Equals("Admin", StringComparison.OrdinalIgnoreCase);
    }

    public bool SessionExists(string? sessionId)
    {
        if (string.IsNullOrEmpty(sessionId))
        {
            return false;
        }

        string key = $"session:{sessionId}";

        return database.KeyExists(key);
    }
}