import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  FileText,
  Search,
  Server,
  ShieldAlert,
} from "lucide-react";
import { getLogs } from "../services/api";
import type { LogEntry } from "../services/api";

function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] =
    useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadLogs() {
    try {
      setLoading(true);

      const data = await getLogs();

      setLogs(data);
      setError("");
    } catch {
      setError(
        "Unable to load system logs. Please check the API connection."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    return logs.filter((log) => {
      const matchesSearch =
        searchValue === "" ||
        log.message
          .toLowerCase()
          .includes(searchValue) ||
        log.source
          .toLowerCase()
          .includes(searchValue) ||
        log.level
          .toLowerCase()
          .includes(searchValue);

      const matchesLevel =
        levelFilter === "all" ||
        log.level.toLowerCase() ===
          levelFilter.toLowerCase();

      return (
        matchesSearch && matchesLevel
      );
    });
  }, [logs, search, levelFilter]);

  const errorCount = logs.filter(
    (log) =>
      log.level.toLowerCase() === "error"
  ).length;

  const warningCount = logs.filter(
    (log) =>
      log.level.toLowerCase() === "warning" ||
      log.level.toLowerCase() === "warn"
  ).length;

  const infoCount = logs.filter(
    (log) =>
      log.level.toLowerCase() === "info"
  ).length;

  function getLevelClass(level: string) {
    switch (level.toLowerCase()) {
      case "error":
      case "critical":
        return "log-level-error";

      case "warning":
      case "warn":
        return "log-level-warning";

      case "success":
        return "log-level-success";

      default:
        return "log-level-info";
    }
  }

  function getLevelIcon(level: string) {
    switch (level.toLowerCase()) {
      case "error":
      case "critical":
        return <ShieldAlert size={14} />;

      case "warning":
      case "warn":
        return <AlertTriangle size={14} />;

      case "success":
        return <CheckCircle2 size={14} />;

      default:
        return <Activity size={14} />;
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
        second: "2-digit",
      }
    );
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <div className="eyebrow">
            <Activity size={15} />
            SECURITY EVENT MONITORING
          </div>

          <h1>System Logs</h1>

          <p>
            Monitor application and security
            events across the IncidentSystem
            services.
          </p>
        </div>

        <div className="header-actions">
          <button
            className="secondary-button"
            type="button"
            onClick={loadLogs}
            disabled={loading}
          >
            <Activity size={16} />
            Refresh Logs
          </button>
        </div>
      </div>

      <div className="incident-summary">
        <div className="summary-card">
          <div className="summary-icon blue">
            <FileText size={19} />
          </div>

          <div>
            <span>TOTAL EVENTS</span>
            <strong>{logs.length}</strong>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon blue">
            <Activity size={19} />
          </div>

          <div>
            <span>INFO</span>
            <strong>{infoCount}</strong>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon orange">
            <AlertTriangle size={19} />
          </div>

          <div>
            <span>WARNINGS</span>
            <strong>{warningCount}</strong>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon red">
            <ShieldAlert size={19} />
          </div>

          <div>
            <span>ERRORS</span>
            <strong>{errorCount}</strong>
          </div>
        </div>
      </div>

      <section className="panel incidents-table-panel">
        <div className="panel-header">
          <div>
            <h2>Event Registry</h2>

            <p>
              {filteredLogs.length} of{" "}
              {logs.length} events displayed
            </p>
          </div>

          <div className="table-tools">
            <div className="search-box">
              <Search size={17} />

              <input
                type="text"
                placeholder="Search logs..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>

            <select
              className="log-filter"
              value={levelFilter}
              onChange={(event) =>
                setLevelFilter(
                  event.target.value
                )
              }
            >
              <option value="all">
                All levels
              </option>
              <option value="info">
                Info
              </option>
              <option value="warning">
                Warning
              </option>
              <option value="error">
                Error
              </option>
              <option value="critical">
                Critical
              </option>
              <option value="success">
                Success
              </option>
            </select>
          </div>
        </div>

        {error && (
          <div className="table-error">
            <ShieldAlert size={17} />
            {error}
          </div>
        )}

        {loading ? (
          <div className="table-loading">
            <div className="loading-spinner" />
            Loading system logs...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="empty-state">
            <Activity size={30} />

            <strong>
              No log entries found
            </strong>

            <span>
              There are currently no events
              matching your filters.
            </span>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="incidents-table logs-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>TIMESTAMP</th>
                  <th>LEVEL</th>
                  <th>MESSAGE</th>
                  <th>SOURCE</th>
                </tr>
              </thead>

              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <span className="incident-id">
                        #
                        {log.id
                          .toString()
                          .padStart(
                            4,
                            "0"
                          )}
                      </span>
                    </td>

                    <td>
                      <div className="log-timestamp">
                        <Clock3 size={14} />
                        {formatDate(
                          log.timestamp
                        )}
                      </div>
                    </td>

                    <td>
                      <span
                        className={`log-level ${getLevelClass(
                          log.level
                        )}`}
                      >
                        {getLevelIcon(
                          log.level
                        )}

                        {log.level}
                      </span>
                    </td>

                    <td>
                      <div className="log-message">
                        {log.message}
                      </div>
                    </td>

                    <td>
                      <div className="log-source">
                        <Server size={14} />
                        {log.source}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="permission-note">
        <Activity size={16} />

        <span>
          Logs are stored in the Redis logging
          service and displayed here as the
          central system activity feed.
        </span>
      </div>
    </div>
  );
}

export default LogsPage;