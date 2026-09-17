import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Edit3,
  Mail,
  Plus,
  Search,
  Shield,
  ShieldAlert,
  UserCheck,
  UserX,
} from "lucide-react";
import UserModal from "../components/UserModal";
import {
  changeUserStatus,
  getUsers,
} from "../services/api";
import type { User } from "../services/api";

type UsersPageProps = {
  username: string;
};

function UsersPage({ username }: UsersPageProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] =
    useState<User | null>(null);

  const [actionLoading, setActionLoading] =
    useState<number | null>(null);

  async function loadUsers() {
    try {
      setLoading(true);

      const data = await getUsers();

      setUsers(data);
      setError("");
    } catch {
      setError(
        "Unable to load users. Please check the API connection."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    if (!searchValue) {
      return users;
    }

    return users.filter(
      (user) =>
        user.username
          .toLowerCase()
          .includes(searchValue) ||
        user.email
          .toLowerCase()
          .includes(searchValue)
    );
  }, [users, search]);

  const activeUsers = users.filter(
    (user) => user.isActive
  ).length;

  const adminUsers = users.filter(
    (user) => user.role === 0
  ).length;

  const inactiveUsers = users.filter(
    (user) => !user.isActive
  ).length;

  function getRoleLabel(role: number) {
    return role === 0
      ? "Administrator"
      : "Security User";
  }

  function openCreateModal() {
    setEditingUser(null);
    setModalOpen(true);
  }

  function openEditModal(user: User) {
    setEditingUser(user);
    setModalOpen(true);
  }

  function handleSaved(savedUser: User) {
    setUsers((current) => {
      const exists = current.some(
        (user) => user.id === savedUser.id
      );

      if (exists) {
        return current.map((user) =>
          user.id === savedUser.id
            ? savedUser
            : user
        );
      }

      return [savedUser, ...current];
    });

    setModalOpen(false);
    setEditingUser(null);
  }

  async function handleStatusChange(
    user: User
  ) {
    if (actionLoading !== null) {
      return;
    }

    const newStatus = !user.isActive;

    const action = newStatus
      ? "activate"
      : "disable";

    const confirmed = window.confirm(
      `${action === "activate" ? "Activate" : "Disable"} user "${user.username}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(user.id);

      const updatedUser =
        await changeUserStatus(
          user.id,
          newStatus
        );

      setUsers((current) =>
        current.map((item) =>
          item.id === updatedUser.id
            ? updatedUser
            : item
        )
      );

      setError("");
    } catch {
      setError(
        `Failed to ${action} user "${user.username}".`
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
            <Shield size={15} />
            IDENTITY & ACCESS MANAGEMENT
          </div>

          <h1>Users</h1>

          <p>
            Manage security accounts, roles and
            access status.
          </p>
        </div>

        <div className="header-actions">
          <div className="incident-count">
            <span className="status-dot" />
            {activeUsers} active
          </div>

          <button
            className="primary-button"
            type="button"
            onClick={openCreateModal}
          >
            <Plus size={17} />
            New User
          </button>
        </div>
      </div>

      <div className="incident-summary">
        <div className="summary-card">
          <div className="summary-icon blue">
            <Shield size={19} />
          </div>

          <div>
            <span>ALL USERS</span>
            <strong>{users.length}</strong>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon green">
            <UserCheck size={19} />
          </div>

          <div>
            <span>ACTIVE</span>
            <strong>{activeUsers}</strong>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon purple">
            <ShieldAlert size={19} />
          </div>

          <div>
            <span>ADMINISTRATORS</span>
            <strong>{adminUsers}</strong>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon orange">
            <UserX size={19} />
          </div>

          <div>
            <span>DISABLED</span>
            <strong>{inactiveUsers}</strong>
          </div>
        </div>
      </div>

      <section className="panel incidents-table-panel">
        <div className="panel-header">
          <div>
            <h2>User Registry</h2>

            <p>
              {filteredUsers.length} of{" "}
              {users.length} users displayed
            </p>
          </div>

          <div className="table-tools">
            <div className="search-box">
              <Search size={17} />

              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>
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
            Loading user registry...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="empty-state">
            <Shield size={30} />

            <strong>No users found</strong>

            <span>
              Try changing your search criteria.
            </span>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="incidents-table users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>USER</th>
                  <th>EMAIL</th>
                  <th>ROLE</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => {
                  const isActionLoading =
                    actionLoading === user.id;

                  return (
                    <tr key={user.id}>
                      <td>
                        <span className="incident-id">
                          #
                          {user.id
                            .toString()
                            .padStart(4, "0")}
                        </span>
                      </td>

                      <td>
                        <div className="user-table-info">
                          <div className="user-table-avatar">
                            {user.username
                              .substring(0, 2)
                              .toUpperCase()}
                          </div>

                          <div>
                            <div className="table-incident-title">
                              {user.username}
                            </div>

                            <div className="table-incident-meta">
                              User ID {user.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="email-cell">
                          <Mail size={14} />
                          {user.email}
                        </div>
                      </td>

                      <td>
                        <span
                          className={`role-badge ${
                            user.role === 0
                              ? "role-admin"
                              : "role-user"
                          }`}
                        >
                          {user.role === 0 ? (
                            <Shield size={13} />
                          ) : (
                            <UserCheck size={13} />
                          )}

                          {getRoleLabel(
                            user.role
                          )}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`user-status ${
                            user.isActive
                              ? "user-status-active"
                              : "user-status-disabled"
                          }`}
                        >
                          {user.isActive ? (
                            <>
                              <CheckCircle2
                                size={13}
                              />
                              Active
                            </>
                          ) : (
                            <>
                              <UserX
                                size={13}
                              />
                              Disabled
                            </>
                          )}
                        </span>
                      </td>

                      <td>
                        <div className="action-buttons">
                          <button
                            className="table-action"
                            type="button"
                            title="Edit user"
                            onClick={() =>
                              openEditModal(user)
                            }
                            disabled={
                              isActionLoading
                            }
                          >
                            <Edit3 size={15} />
                          </button>

                          <button
                            className={`table-action ${
                              user.isActive
                                ? "disable-action"
                                : "activate-action"
                            }`}
                            type="button"
                            title={
                              user.isActive
                                ? "Disable user"
                                : "Activate user"
                            }
                            onClick={() =>
                              handleStatusChange(
                                user
                              )
                            }
                            disabled={
                              isActionLoading ||
                              user.username ===
                                username
                            }
                          >
                            {user.isActive ? (
                              <UserX
                                size={15}
                              />
                            ) : (
                              <UserCheck
                                size={15}
                              />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="permission-note">
        <ShieldAlert size={16} />

        <span>
          User management is restricted to
          administrators. The currently signed-in
          account <strong>{username}</strong> cannot
          disable itself.
        </span>
      </div>

      {modalOpen && (
        <UserModal
          user={editingUser}
          onClose={() => {
            setModalOpen(false);
            setEditingUser(null);
          }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}

export default UsersPage;