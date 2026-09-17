import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  FileWarning,
  Search,
  ShieldAlert,
} from "lucide-react";
import { getIncidents } from "../services/api";
import type { Incident } from "../services/api";

type DashboardPageProps = {
  username: string;
  isAdmin: boolean;
  onNavigate: (
    page: "dashboard" | "incidents" | "users" | "logs"
  ) => void;
};

function DashboardPage({
  username,
  isAdmin,
  onNavigate,
}: DashboardPageProps) {
  const [incidents, setIncidents] = useState<
    Incident[]
  >([]);

  const [incidentError, setIncidentError] =
    useState("");

  useEffect(() => {
    async function loadIncidents() {
      try {
        const data = await getIncidents();

        setIncidents(data);
        setIncidentError("");
      } catch {
        setIncidentError(
          "Unable to load incident data."
        );
      }
    }

    loadIncidents();
  }, []);

  const openIncidents = incidents.filter(
    (incident) => incident.status === 0
  ).length;

  const criticalIncidents = incidents.filter(
    (incident) => incident.severity === 3
  ).length;

  const escalatedIncidents = incidents.filter(
    (incident) => incident.escalation > 0
  ).length;

  function getSeverityLabel(
    severity: number
  ) {
    switch (severity) {
      case 0:
        return "Low";
      case 1:
        return "Medium";
      case 2:
        return "High";
      case 3:
        return "Critical";
      default:
        return "Unknown";
    }
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <div className="eyebrow">
            <ShieldAlert size={15} />
            SECURITY OPERATIONS CENTER
          </div>

          <h1>Security Overview</h1>

          <p>
            Welcome back, {username}. Monitor and
            manage security incidents across your
            infrastructure.
          </p>
        </div>

        <div className="header-actions">
          <button
            className="secondary-button"
            type="button"
          >
            View Reports
          </button>

          <button
            className="primary-button"
            type="button"
            onClick={() =>
              onNavigate("incidents")
            }
          >
            <AlertTriangle size={17} />
            New Incident
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-top">
            <span className="stat-label">
              OPEN INCIDENTS
            </span>

            <div className="stat-icon blue">
              <FileWarning size={19} />
            </div>
          </div>

          <div className="stat-value">
            {incidentError
              ? "--"
              : openIncidents}
          </div>

          <div className="stat-description">
            Active security incidents
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span className="stat-label">
              CRITICAL
            </span>

            <div className="stat-icon red">
              <ShieldAlert size={19} />
            </div>
          </div>

          <div className="stat-value">
            {incidentError
              ? "--"
              : criticalIncidents}
          </div>

          <div className="stat-description">
            Critical severity incidents
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span className="stat-label">
              ESCALATED
            </span>

            <div className="stat-icon orange">
              <AlertTriangle size={19} />
            </div>
          </div>

          <div className="stat-value">
            {incidentError
              ? "--"
              : escalatedIncidents}
          </div>

          <div className="stat-description">
            Incidents requiring escalation
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span className="stat-label">
              SESSION
            </span>

            <div className="stat-icon green">
              <Activity size={19} />
            </div>
          </div>

          <div className="stat-value status-value">
            <span className="status-dot" />
            Active
          </div>

          <div className="stat-description">
            {isAdmin
              ? "Administrator access"
              : "Security User access"}
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="panel incidents-panel">
          <div className="panel-header">
            <div>
              <h2>Recent Incidents</h2>

              <p>
                Latest security events requiring
                attention
              </p>
            </div>

            <button
              className="text-button"
              type="button"
              onClick={() =>
                onNavigate("incidents")
              }
            >
              View all
            </button>
          </div>

          <div className="toolbar">
            <div className="search-box">
              <Search size={17} />

              <input
                type="text"
                placeholder="Search incidents..."
                readOnly
                onClick={() =>
                  onNavigate("incidents")
                }
              />
            </div>
          </div>

          {incidentError ? (
            <div className="empty-state">
              <FileWarning size={28} />

              <strong>
                Unable to load incidents
              </strong>

              <span>{incidentError}</span>
            </div>
          ) : incidents.length === 0 ? (
            <div className="empty-state">
              <FileWarning size={28} />

              <strong>
                No incidents found
              </strong>

              <span>
                There are currently no security
                incidents.
              </span>
            </div>
          ) : (
            <div className="incident-list">
              {incidents
                .slice(0, 5)
                .map((incident) => (
                  <div
                    className="incident-row"
                    key={incident.id}
                  >
                    <div className="incident-main">
                      <div className="incident-title">
                        {incident.title}
                      </div>

                      <div className="incident-meta">
                        #{incident.id} ·{" "}
                        {incident.system}
                      </div>
                    </div>

                    <div
                      className={`severity severity-${incident.severity}`}
                    >
                      {getSeverityLabel(
                        incident.severity
                      )}
                    </div>

                    <div
                      className={`status status-${incident.status}`}
                    >
                      {incident.status === 0
                        ? "Open"
                        : "Closed"}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </section>

        <section className="panel activity-panel">
          <div className="panel-header">
            <div>
              <h2>System Activity</h2>

              <p>
                Recent security events
              </p>
            </div>

            <button
              className="text-button"
              type="button"
              onClick={() =>
                onNavigate("logs")
              }
            >
              View all
            </button>
          </div>

          <div className="empty-state small">
            <Activity size={25} />

            <strong>
              System activity
            </strong>

            <span>
              Open System Logs to view recent
              events.
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}

export default DashboardPage;