using StackExchange.Redis;
using System;

namespace UserAuthentication.Api.Services;

public class SessionService
{
    private readonly IDatabase database;

    public SessionService(IConnectionMultiplexer redis)
    {
        database = redis.GetDatabase();
    }

    public string CreateSession(int userId, string username, string role)
    {
        string sessionId = Guid.NewGuid().ToString();

        string key = $"session:{sessionId}";

        database.HashSet(key, new HashEntry[]
        {
            new HashEntry("UserId", userId),
            new HashEntry("Username", username),
            new HashEntry("Role", role)
        });

        database.KeyExpire(key, TimeSpan.FromHours(1));

        return sessionId;
    }
        public bool IsAdmin(string sessionId)
    {
        string key = $"session:{sessionId}";

        RedisValue role = database.HashGet(key, "Role");

        return role == "Admin";
    }
}