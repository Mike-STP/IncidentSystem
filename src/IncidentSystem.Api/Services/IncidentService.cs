using IncidentSystem.Api.Models;
namespace IncidentSystem.Api.Services;

public class IncidentService
{
    private readonly List<Incident> incidents = new();

    public List<Incident> GetAll()
    {
        return incidents;
    }

    public Incident? GetById(int id)
    {
        return incidents.FirstOrDefault(i => i.Id == id);
    }

    public Incident Create(Incident incident)
    {
        incident.Id = incidents.Count + 1;
        incident.CreatedAt = DateTime.Now;
        incident.UpdatedAt = DateTime.Now;
        incident.Status = IncidentStatus.Open;
        incident.Escalation = EscalationLevel.None;

        incidents.Add(incident);

        return incident;
    }

    public Incident? Update(int id, Incident updatedIncident)
    {
        Incident? incident = GetById(id);

        if (incident == null)
        {
            return null;
        }

        incident.Title = updatedIncident.Title;
        incident.Description = updatedIncident.Description;
        incident.Severity = updatedIncident.Severity;
        incident.CVE = updatedIncident.CVE;
        incident.System = updatedIncident.System;
        incident.Assignee = updatedIncident.Assignee;
        incident.UpdatedAt = DateTime.Now;

        return incident;
    }

    public bool Close(int id)
    {
        Incident? incident = GetById(id);

        if (incident == null)
        {
            return false;
        }

        incident.Status = IncidentStatus.Closed;
        incident.UpdatedAt = DateTime.Now;

        return true;
    }

    public bool Escalate(int id)
    {
        Incident? incident = GetById(id);

        if (incident == null)
        {
            return false;
        }

        if (incident.Escalation == EscalationLevel.None)
        {
            incident.Escalation = EscalationLevel.Level1;
        }
        else if (incident.Escalation == EscalationLevel.Level1)
        {
            incident.Escalation = EscalationLevel.Level2;
        }
        else if (incident.Escalation == EscalationLevel.Level2)
        {
            incident.Escalation = EscalationLevel.Level3;
        }

        incident.UpdatedAt = DateTime.Now;

        return true;
    }
}