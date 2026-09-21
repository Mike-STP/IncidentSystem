import {
  Activity,
  FileWarning,
  LayoutDashboard,
  LogOut,
  Settings,
  Shield,
  Users,
} from "lucide-react";

export type Page =
  | "dashboard"
  | "incidents"
  | "users"
  | "logs";

type SidebarProps = {
  isAdmin: boolean;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
};

function Sidebar({
  isAdmin,
  currentPage,
  onNavigate,
  onLogout,
}: SidebarProps) {
  return (
    <div className="sidebar-content">
      <div className="brand">
        <div className="brand-icon">
          <Shield size={22} />
        </div>

        <div>
          <div className="brand-title">
            IncidentSystem
          </div>

          <div className="brand-subtitle">
            SECURITY OPERATIONS
          </div>
        </div>
      </div>

      <div className="nav-section">
        <div className="nav-label">
          MONITORING
        </div>

        <button
          className={`nav-item ${
            currentPage === "dashboard"
              ? "active"
              : ""
          }`}
          onClick={() =>
            onNavigate("dashboard")
          }
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </button>

        <button
          className={`nav-item ${
            currentPage === "incidents"
              ? "active"
              : ""
          }`}
          onClick={() =>
            onNavigate("incidents")
          }
        >
          <FileWarning size={18} />
          <span>Incidents</span>
        </button>
      </div>

      {isAdmin && (
        <div className="nav-section">
          <div className="nav-label">
            MANAGEMENT
          </div>

          <button
            className={`nav-item ${
              currentPage === "users"
                ? "active"
                : ""
            }`}
            onClick={() =>
              onNavigate("users")
            }
          >
            <Users size={18} />
            <span>Users</span>
          </button>

          <button
            className={`nav-item ${
              currentPage === "logs"
                ? "active"
                : ""
            }`}
            onClick={() =>
              onNavigate("logs")
            }
          >
            <Activity size={18} />
            <span>System Logs</span>
          </button>
        </div>
      )}

      <div className="sidebar-bottom">
        <button className="nav-item">
          <Settings size={18} />
          <span>Settings</span>
        </button>

        <button
          className="nav-item logout-item"
          onClick={onLogout}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>

        <div className="system-status">
          <span className="status-dot" />

          <div>
            <div className="status-title">
              All systems operational
            </div>

            <div className="status-subtitle">
              API services connected
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;