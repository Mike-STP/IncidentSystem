import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Edit3,
  FileWarning,
  Plus,
  Search,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";
import IncidentModal from "../components/IncidentModal";
import {
  closeIncident,
  escalateIncident,
  getIncidents,
} from "../services/api";
import type { Incident } from "../services/api";

type IncidentsPageProps = {
  isAdmin: boolean;
  username: string;
};

function IncidentsPage({
  isAdmin,
  username,
}: IncidentsPageProps) {
  const [incidents, setIncidents] = useState<
    Incident[]
  >([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [editingIncident, setEditingIncident] =
    useState<Incident | null>(null);

  const [actionLoading, setActionLoading] =
    useState<number | null>(null);

  const [severityFilter, setSeverityFilter] =
    useState("all");

  const [statusFilter, setStatusFilter] =
    useState("all");

  async function loadIncidents() {
    try {
      setLoading(true);

      const data = await getIncidents();

      setIncidents(data);
      setError("");
    } catch {
      setError(
        "Unable to load incidents. Please check the API connection."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadIncidents();
  }, []);

  const filteredIncidents = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    return incidents.filter((incident) => {
      const matchesSearch =
        searchValue === "" ||
        incident.title
          .toLowerCase()
          .includes(searchValue) ||
        incident.description
          .toLowerCase()
          .includes(searchValue) ||
        incident.system
          .toLowerCase()
          .includes(searchValue) ||
        incident.reporter
          .toLowerCase()
          .includes(searchValue) ||
        (incident.assignee ?? "")
          .toLowerCase()
          .includes(searchValue) ||
        (incident.cve ?? "")
          .toLowerCase()
          .includes(searchValue);

      const matchesSeverity =
        severityFilter === "all" ||
        incident.severity ===
          Number(severityFilter);

      const matchesStatus =
        statusFilter === "all" ||
        incident.status ===
          Number(statusFilter);

      return (
        matchesSearch &&
        matchesSeverity &&
        matchesStatus
      );
    });
  }, [
    incidents,
    search,
    severityFilter,
    statusFilter,
  ]);

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
  
  function getEscalationLabel(
    escalation: number
  ) {
    switch (escalation) {
      case 0:
        return "None";
      case 1:
        return "Level 1";
      case 2:
        return "Level 2";
      case 3:
        return "Level 3";
      default:
        return "Unknown";
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString(
      "en-GB",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }

  function openCreateModal() {
    setEditingIncident(null);
    setModalOpen(true);
  }

  function openEditModal(
    incident: Incident
  ) {
    setEditingIncident(incident);
    setModalOpen(true);
  }

  function handleSaved(
    savedIncident: Incident
  ) {
    setIncidents((current) => {
      const exists = current.some(
        (incident) =>
          incident.id === savedIncident.id
      );

      if (exists) {
        return current.map((incident) =>
          incident.id === savedIncident.id
            ? savedIncident
            : incident
        );
      }

      return [savedIncident, ...current];
    });

    setModalOpen(false);
    setEditingIncident(null);
  }

  async function handleClose(
    incident: Incident
  ) {
    if (actionLoading !== null) {
      return;
    }

    const confirmed = window.confirm(
      `Close incident #${incident.id}?\n\n${incident.title}`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(incident.id);

      await closeIncident(incident.id);

      setIncidents((current) =>
        current.map((item) =>
          item.id === incident.id
            ? {
                ...item,
                status: 1,
                updatedAt:
                  new Date().toISOString(),
              }
            : item
        )
      );

      setError("");
    } catch {
      setError(
        `Failed to close incident #${incident.id}.`
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleEscalate(
    incident: Incident
  ) {
    if (actionLoading !== null) {
      return;
    }

    if (incident.escalation >= 3) {
      return;
    }

    try {
      setActionLoading(incident.id);

      await escalateIncident(incident.id);

      setIncidents((current) =>
        current.map((item) =>
          item.id === incident.id
            ? {
                ...item,
                escalation:
                  item.escalation + 1,
                updatedAt:
                  new Date().toISOString(),
              }
            : item
        )
      );

      setError("");
    } catch {
      setError(
        `Failed to escalate incident #${incident.id}.`
      );
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <div className="eyebrow">
            <FileWarning size={15} />
            SECURITY INCIDENT MANAGEMENT
          </div>

          <h1>Incidents</h1>

          <p>
            Monitor, investigate and manage
            security incidents.
          </p>
        </div>

        <div className="header-actions">
          <div className="incident-count">
            <span className="status-dot" />
            {incidents.filter(
              (incident) =>
                incident.status === 0
            ).length}{" "}
            open
          </div>

          <button
            className="primary-button"
            type="button"
            onClick={openCreateModal}
          >
            <Plus size={17} />
            New Incident
          </button>
        </div>
      </div>

      <div className="incident-summary">
        <div className="summary-card">
          <div className="summary-icon blue">
            <FileWarning size={19} />
          </div>

          <div>
            <span>ALL INCIDENTS</span>
            <strong>{incidents.length}</strong>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon orange">
            <AlertTriangle size={19} />
          </div>

          <div>
            <span>OPEN</span>
            <strong>
              {
                incidents.filter(
                  (incident) =>
                    incident.status === 0
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon red">
            <ShieldAlert size={19} />
          </div>

          <div>
            <span>CRITICAL</span>
            <strong>
              {
                incidents.filter(
                  (incident) =>
                    incident.severity === 3
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon purple">
            <TrendingUp size={19} />
          </div>

          <div>
            <span>ESCALATED</span>
            <strong>
              {
                incidents.filter(
                  (incident) =>
                    incident.escalation > 0
                ).length
              }
            </strong>
          </div>
        </div>
      </div>

      <section className="panel incidents-table-panel">
        <div className="panel-header">
          <div>
            <h2>Incident Registry</h2>

            <p>
              {filteredIncidents.length} of{" "}
              {incidents.length} incidents
              displayed
            </p>
          </div>

          <div className="table-tools">
            <div className="search-box">
              <Search size={17} />

              <input
                type="text"
                placeholder="Search incidents..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>

            <div className="filter-select">
              <select
                value={severityFilter}
                onChange={(event) =>
                  setSeverityFilter(
                    event.target.value
                  )
                }
              >
                <option value="all">
                  All severities
                </option>
                <option value="0">Low</option>
                <option value="1">
                  Medium
                </option>
                <option value="2">High</option>
                <option value="3">
                  Critical
                </option>
              </select>

              <ChevronDown size={15} />
            </div>

            <div className="filter-select">
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
              >
                <option value="all">
                  All statuses
                </option>
                <option value="0">Open</option>
                <option value="1">
                  Closed
                </option>
              </select>

              <ChevronDown size={15} />
            </div>
          </div>
        </div>

        {error && (
          <div className="table-error">
            <AlertTriangle size={17} />
            {error}
          </div>
        )}

        {loading ? (
          <div className="table-loading">
            <div className="loading-spinner" />
            Loading incident registry...
          </div>
        ) : filteredIncidents.length ===
          0 ? (
          <div className="empty-state">
            <FileWarning size={30} />

            <strong>
              No incidents found
            </strong>

            <span>
              Try changing your search or
              filter settings.
            </span>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="incidents-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>INCIDENT</th>
                  <th>SYSTEM</th>
                  <th>SEVERITY</th>
                  <th>STATUS</th>
                  <th>ESCALATION</th>
                  <th>ASSIGNEE</th>
                  <th>CREATED</th>
                  {isAdmin && (
                    <th>ACTIONS</th>
                  )}
                </tr>
              </thead>

              <tbody>
                {filteredIncidents.map(
                  (incident) => {
                    const isActionLoading =
                      actionLoading ===
                      incident.id;

                    return (
                      <tr
                        key={incident.id}
                      >
                        <td>
                          <span className="incident-id">
                            #
                            {incident.id
                              .toString()
                              .padStart(
                                4,
                                "0"
                              )}
                          </span>
                        </td>

                        <td>
                          <div className="table-incident">
                            <div className="table-incident-title">
                              {
                                incident.title
                              }
                            </div>

                            <div className="table-incident-meta">
                              Reporter:{" "}
                              {
                                incident.reporter
                              }

                              {incident.cve && (
                                <>
                                  {" · "}
                                  {
                                    incident.cve
                                  }
                                </>
                              )}
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="system-name">
                            {
                              incident.system
                            }
                          </span>
                        </td>

                        <td>
                          <span
                            className={`severity severity-${incident.severity}`}
                          >
                            <span className="severity-dot" />
                            {getSeverityLabel(
                              incident.severity
                            )}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`status status-${incident.status}`}
                          >
                            {incident.status ===
                              0 && (
                              <span className="status-dot" />
                            )}

                            {incident.status ===
                            0 ? (
                              "Open"
                            ) : (
                              <>
                                <CheckCircle2
                                  size={
                                    13
                                  }
                                />
                                Closed
                              </>
                            )}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`escalation escalation-${incident.escalation}`}
                          >
                            {getEscalationLabel(
                              incident.escalation
                            )}
                          </span>
                        </td>

                        <td>
                          <span className="assignee">
                            {incident.assignee ??
                              "Unassigned"}
                          </span>
                        </td>

                        <td>
                          <span className="created-date">
                            {formatDate(
                              incident.createdAt
                            )}
                          </span>
                        </td>

                        {isAdmin && (
                          <td>
                            <div className="action-buttons">
                              <button
                                className="table-action"
                                type="button"
                                title="Edit incident"
                                onClick={() =>
                                  openEditModal(
                                    incident
                                  )
                                }
                                disabled={
                                  isActionLoading
                                }
                              >
                                <Edit3
                                  size={15}
                                />
                              </button>

                              <button
                                className="table-action"
                                type="button"
                                title="Escalate incident"
                                onClick={() =>
                                  handleEscalate(
                                    incident
                                  )
                                }
                                disabled={
                                  isActionLoading ||
                                  incident.escalation >=
                                    3 ||
                                  incident.status !==
                                    0
                                }
                              >
                                <TrendingUp
                                  size={15}
                                />
                              </button>

                              <button
                                className="table-action close-action"
                                type="button"
                                title="Close incident"
                                onClick={() =>
                                  handleClose(
                                    incident
                                  )
                                }
                                disabled={
                                  isActionLoading ||
                                  incident.status !==
                                    0
                                }
                              >
                                <CheckCircle2
                                  size={15}
                                />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {!isAdmin && (
        <div className="permission-note">
          <ShieldAlert size={16} />

          <span>
            You are signed in as{" "}
            <strong>{username}</strong>.
            Incident creation is available,
            while editing, closing and
            escalation require administrator
            privileges.
          </span>
        </div>
      )}

      {modalOpen && (
        <IncidentModal
          incident={editingIncident}
          username={username}
          onClose={() => {
            setModalOpen(false);
            setEditingIncident(null);
          }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}

export default IncidentsPage;