import { useEffect, useState } from "react";
import type { ComponentProps } from "react";
import { X } from "lucide-react";
import {
  createIncident,
  updateIncident,
} from "../services/api";
import type {
  Incident,
  IncidentRequest,
} from "../services/api";

type FormSubmitHandler = NonNullable<
  ComponentProps<"form">["onSubmit"]
>;

type IncidentModalProps = {
  incident?: Incident | null;
  username: string;
  onClose: () => void;
  onSaved: (incident: Incident) => void;
};

function IncidentModal({
  incident,
  username,
  onClose,
  onSaved,
}: IncidentModalProps) {
  const isEditing = Boolean(incident);

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [severity, setSeverity] = useState(0);
  const [cve, setCve] = useState("");
  const [system, setSystem] = useState("");
  const [assignee, setAssignee] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (incident) {
      setTitle(incident.title);
      setDescription(incident.description);
      setSeverity(incident.severity);
      setCve(incident.cve ?? "");
      setSystem(incident.system);
      setAssignee(incident.assignee ?? "");
    } else {
      setTitle("");
      setDescription("");
      setSeverity(0);
      setCve("");
      setSystem("");
      setAssignee("");
    }

    setError("");
  }, [incident]);

  const handleSubmit: FormSubmitHandler = async (
    event
  ) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    const request: IncidentRequest = {
      title: title.trim(),
      description: description.trim(),
      severity,
      cve: cve.trim() || null,
      system: system.trim(),
      reporter:
        incident?.reporter ?? username,
      assignee: assignee.trim() || null,
    };

    try {
      let savedIncident: Incident;

      if (incident) {
        savedIncident = await updateIncident(
          incident.id,
          request
        );
      } else {
        savedIncident = await createIncident(
          request
        );
      }

      onSaved(savedIncident);
    } catch {
      setError(
        isEditing
          ? "Failed to update incident."
          : "Failed to create incident."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
    >
      <div
        className="incident-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="modal-header">
          <div>
            <div className="modal-eyebrow">
              SECURITY INCIDENT
            </div>

            <h2>
              {isEditing
                ? "Edit Incident"
                : "Create Incident"}
            </h2>

            <p>
              {isEditing
                ? "Update the incident information."
                : "Register a new security incident."}
            </p>
          </div>

          <button
            className="modal-close"
            type="button"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form
          className="incident-form"
          onSubmit={handleSubmit}
        >
          <div className="form-grid">
            <div className="form-group full">
              <label htmlFor="incident-title">
                TITLE
              </label>

              <input
                id="incident-title"
                type="text"
                placeholder="e.g. Suspicious login activity"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                required
              />
            </div>

            <div className="form-group full">
              <label htmlFor="incident-description">
                DESCRIPTION
              </label>

              <textarea
                id="incident-description"
                placeholder="Describe the security incident..."
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                rows={5}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="incident-severity">
                SEVERITY
              </label>

              <select
                id="incident-severity"
                value={severity}
                onChange={(event) =>
                  setSeverity(
                    Number(event.target.value)
                  )
                }
              >
                <option value={0}>
                  Low
                </option>

                <option value={1}>
                  Medium
                </option>

                <option value={2}>
                  High
                </option>

                <option value={3}>
                  Critical
                </option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="incident-system">
                SYSTEM
              </label>

              <input
                id="incident-system"
                type="text"
                placeholder="e.g. Web Server"
                value={system}
                onChange={(event) =>
                  setSystem(event.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="incident-cve">
                CVE
              </label>

              <input
                id="incident-cve"
                type="text"
                placeholder="e.g. CVE-2026-12345"
                value={cve}
                onChange={(event) =>
                  setCve(event.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="incident-assignee">
                ASSIGNEE
              </label>

              <input
                id="incident-assignee"
                type="text"
                placeholder="e.g. security-team"
                value={assignee}
                onChange={(event) =>
                  setAssignee(event.target.value)
                }
              />
            </div>
          </div>

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <div className="modal-footer">
            <button
              className="secondary-button"
              type="button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              className="primary-button"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "SAVING..."
                : isEditing
                ? "Save Changes"
                : "Create Incident"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default IncidentModal;