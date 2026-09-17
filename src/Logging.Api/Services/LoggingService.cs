using Logging.Api.Models;
using StackExchange.Redis;
using System.Text.Json;

namespace Logging.Api.Services;

public class LoggingService
{
    private readonly IDatabase database;

    public LoggingService(IConnectionMultiplexer redis)
    {
        database = redis.GetDatabase();
    }

    public List<LogEntry> GetAll()
    {
        List<LogEntry> logs = new();

        RedisValue[] entries = database.ListRange("logs");

        foreach (RedisValue entry in entries)
        {
            LogEntry? log = JsonSerializer.Deserialize<LogEntry>(
                entry.ToString());

            if (log != null)
            {
                logs.Add(log);
            }
        }

        return logs;
    }

    public LogEntry? GetById(int id)
    {
        RedisValue[] entries = database.ListRange("logs");

        foreach (RedisValue entry in entries)
        {
            LogEntry? log = JsonSerializer.Deserialize<LogEntry>(
                entry.ToString());

            if (log != null && log.Id == id)
            {
                return log;
            }
        }

        return null;
    }

    public LogEntry Create(LogEntry log)
    {
        RedisValue[] entries = database.ListRange("logs");

        log.Id = entries.Length + 1;
        log.Timestamp = DateTime.UtcNow;

        string json = JsonSerializer.Serialize(log);

        database.ListRightPush("logs", json);

        return log;
    }
}