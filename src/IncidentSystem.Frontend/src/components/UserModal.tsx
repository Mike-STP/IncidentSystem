import { useEffect, useState } from "react";
import type { ComponentProps } from "react";
import { X } from "lucide-react";
import {
  createUser,
  updateUser,
} from "../services/api";
import type {
  User,
  CreateUserRequest,
} from "../services/api";

type FormSubmitHandler = NonNullable<
  ComponentProps<"form">["onSubmit"]
>;

type UserModalProps = {
  user?: User | null;
  onClose: () => void;
  onSaved: (user: User) => void;
};

function UserModal({
  user,
  onClose,
  onSaved,
}: UserModalProps) {
  const isEditing = Boolean(user);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(1);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setPassword("");
      setRole(user.role);
      setIsActive(user.isActive);
    } else {
      setUsername("");
      setEmail("");
      setPassword("");
      setRole(1);
      setIsActive(true);
    }

    setError("");
  }, [user]);

  const handleSubmit: FormSubmitHandler = async (
    event
  ) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    const request: CreateUserRequest = {
      username: username.trim(),
      email: email.trim(),
      password,
      role,
      isActive,
    };

    if (isEditing && !password) {
      setError(
        "Please enter a password when updating a user."
      );
      setLoading(false);
      return;
    }

    try {
      let savedUser: User;

      if (user) {
        savedUser = await updateUser(
          user.id,
          request
        );
      } else {
        savedUser = await createUser(request);
      }

      onSaved(savedUser);
    } catch {
      setError(
        isEditing
          ? "Failed to update user."
          : "Failed to create user."
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
        className="user-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="modal-header">
          <div>
            <div className="modal-eyebrow">
              USER MANAGEMENT
            </div>

            <h2>
              {isEditing
                ? "Edit User"
                : "Create User"}
            </h2>

            <p>
              {isEditing
                ? "Update account information and permissions."
                : "Create a new IncidentSystem user account."}
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
          className="user-form"
          onSubmit={handleSubmit}
        >
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="user-username">
                USERNAME
              </label>

              <input
                id="user-username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="user-email">
                EMAIL
              </label>

              <input
                id="user-email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="user-password">
                PASSWORD
              </label>

              <input
                id="user-password"
                type="password"
                placeholder={
                  isEditing
                    ? "Enter new password"
                    : "Enter password"
                }
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required={!isEditing}
              />
            </div>

            <div className="form-group">
              <label htmlFor="user-role">
                ROLE
              </label>

              <select
                id="user-role"
                value={role}
                onChange={(event) =>
                  setRole(
                    Number(event.target.value)
                  )
                }
              >
                <option value={0}>
                  Administrator
                </option>

                <option value={1}>
                  Security User
                </option>
              </select>
            </div>

            <div className="form-group full">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(event) =>
                    setIsActive(
                      event.target.checked
                    )
                  }
                />

                <span>
                  Account is active
                </span>
              </label>
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
                : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserModal;