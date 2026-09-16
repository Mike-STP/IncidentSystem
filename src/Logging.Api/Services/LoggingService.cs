using Logging.Api.Models;

namespace Logging.Api.Services;

public class LoggingService
{
    private readonly List<LogEntry> logs = new();

    public List<LogEntry> GetAll()
    {
        return logs;
    }

    public LogEntry? GetById(int id)
    {
        return logs.FirstOrDefault(l => l.Id == id);
    }

    public LogEntry Create(LogEntry log)
    {
        log.Id = logs.Count + 1;
        log.Timestamp = DateTime.UtcNow;

        logs.Add(log);

        return log;
    }
}