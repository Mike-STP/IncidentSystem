namespace IncidentSystem.Api.Models;

public class Incident
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public Severity Severity { get; set; }
    public IncidentStatus Status { get; set; }

    public string? CVE { get; set; }
    public string System { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public string Reporter { get; set; } = string.Empty;
    public string? Assignee { get; set; }

    public EscalationLevel Escalation { get; set; }
}