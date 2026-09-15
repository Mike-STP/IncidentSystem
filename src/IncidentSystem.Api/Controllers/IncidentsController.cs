using IncidentSystem.Api.Models;
using IncidentSystem.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace IncidentSystem.Api.Controllers;

[ApiController]
[Route("api/incidents")]

public class IncidentsController : ControllerBase
{
    private readonly IncidentService incidentService;

    public IncidentsController(IncidentService incidentService)
    {
        this.incidentService = incidentService;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(incidentService.GetAll());
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        Incident? incident = incidentService.GetById(id);

        if (incident == null)
        {
            return NotFound();
        }

        return Ok(incident);
    }

    [HttpPost]
    public IActionResult Create(Incident incident)
    {
        Incident createdIncident = incidentService.Create(incident);

        return CreatedAtAction(
            nameof(GetById),
            new { id = createdIncident.Id },
            createdIncident);
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, Incident incident)
    {
        Incident? updatedIncident = incidentService.Update(id, incident);

        if (updatedIncident == null)
        {
            return NotFound();
        }

        return Ok(updatedIncident);
    }

    [HttpPut("{id}/close")]
    public IActionResult Close(int id)
    {
        bool closed = incidentService.Close(id);

        if (!closed)
        {
            return NotFound();
        }

        return Ok();
    }

    [HttpPut("{id}/escalate")]
    public IActionResult Escalate(int id)
    {
        bool escalated = incidentService.Escalate(id);

        if (!escalated)
        {
            return NotFound();
        }

        return Ok();
    }
}