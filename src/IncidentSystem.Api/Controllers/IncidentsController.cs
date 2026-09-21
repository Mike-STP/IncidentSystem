using IncidentSystem.Api.Models;
using IncidentSystem.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace IncidentSystem.Api.Controllers;

[ApiController]
[Route("api/incidents")]
public class IncidentsController : ControllerBase
{
    private readonly IncidentService incidentService;
    private readonly SessionService incidentSessionService;
    private readonly IHttpClientFactory httpClientFactory;

    public IncidentsController(
        IncidentService incidentService,
        SessionService incidentSessionService,
        IHttpClientFactory httpClientFactory)
    {
        this.incidentService = incidentService;
        this.incidentSessionService = incidentSessionService;
        this.httpClientFactory = httpClientFactory;
    }

    [HttpGet]
    public IActionResult GetAll(
        [FromHeader(Name = "X-Session-Id")] string? sessionId)
    {
        if (!incidentSessionService.IsAdmin(sessionId))
        {
            return StatusCode(403);
        }

        return Ok(incidentService.GetAll());
    }

    [HttpGet("{id}")]
    public IActionResult GetById(
        int id,
        [FromHeader(Name = "X-Session-Id")] string? sessionId)
    {
        if (!incidentSessionService.IsAdmin(sessionId))
        {
            return StatusCode(403);
        }

        Incident? incident = incidentService.GetById(id);

        if (incident == null)
        {
            return NotFound();
        }

        return Ok(incident);
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        Incident incident,
        [FromHeader(Name = "X-Session-Id")] string? sessionId)
    {
        if (!incidentSessionService.SessionExists(sessionId))
        {
            return StatusCode(403);
        }

        Incident createdIncident = incidentService.Create(incident);

        var loggingClient = httpClientFactory.CreateClient("LoggingApi");

        var logEntry = new
        {
            Level = "INFO",
            Message = $"Incident #{createdIncident.Id} wurde erstellt.",
            Source = "IncidentSystem.Api"
        };

        await loggingClient.PostAsJsonAsync("api/logs", logEntry);

        return CreatedAtAction(
            nameof(GetById),
            new { id = createdIncident.Id },
            createdIncident);
    }

    [HttpPut("{id}")]
    public IActionResult Update(
        int id,
        Incident incident,
        [FromHeader(Name = "X-Session-Id")] string? sessionId)
    {
        if (!incidentSessionService.IsAdmin(sessionId))
        {
            return StatusCode(403);
        }

        Incident? updatedIncident = incidentService.Update(id, incident);

        if (updatedIncident == null)
        {
            return NotFound();
        }

        return Ok(updatedIncident);
    }

    [HttpPut("{id}/close")]
    public IActionResult Close(
        int id,
        [FromHeader(Name = "X-Session-Id")] string? sessionId)
    {
        if (!incidentSessionService.IsAdmin(sessionId))
        {
            return StatusCode(403);
        }

        bool closed = incidentService.Close(id);

        if (!closed)
        {
            return NotFound();
        }

        return Ok();
    }

    [HttpPut("{id}/escalate")]
    public IActionResult Escalate(
        int id,
        [FromHeader(Name = "X-Session-Id")] string? sessionId)
    {
        if (!incidentSessionService.IsAdmin(sessionId))
        {
            return StatusCode(403);
        }

        bool success = incidentService.Escalate(id);

        if (!success)
        {
            return NotFound();
        }

        return Ok();
    }
}