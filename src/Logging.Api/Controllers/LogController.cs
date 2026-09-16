using Logging.Api.Models;
using Logging.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Logging.Api.Controllers;

[ApiController]
[Route("api/logs")]
public class LogController : ControllerBase
{
    private readonly LoggingService loggingService;

    public LogController(LoggingService loggingService)
    {
        this.loggingService = loggingService;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(loggingService.GetAll());
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        LogEntry? log = loggingService.GetById(id);

        if (log == null)
        {
            return NotFound();
        }

        return Ok(log);
    }

    [HttpPost]
    public IActionResult Create(LogEntry log)
    {
        LogEntry createdLog = loggingService.Create(log);

        return CreatedAtAction(
            nameof(GetById),
            new { id = createdLog.Id },
            createdLog);
    }
}

