import {
  Bell,
  ChevronDown,
} from "lucide-react";

type TopbarProps = {
  username: string;
  isAdmin: boolean;
  currentPage: string;
};

function Topbar({
  username,
  isAdmin,
  currentPage,
}: TopbarProps) {
  const pageTitles: Record<string, string> = {
    dashboard: "Dashboard",
    incidents: "Incidents",
    users: "Users",
    logs: "System Logs",
  };

  const pageTitle =
    pageTitles[currentPage] ?? "Dashboard";

  return (
    <div className="topbar-inner">
      <div className="breadcrumb">
        Security Operations
        <span>/</span>
        <strong>{pageTitle}</strong>
      </div>

      <div className="topbar-right">
        <button
          className="icon-button"
          type="button"
          aria-label="Notifications"
        >
          <Bell size={19} />
          <span className="notification-dot" />
        </button>

        <div className="profile">
          <div className="avatar">
            {username
              .substring(0, 2)
              .toUpperCase()}
          </div>

          <div className="profile-info">
            <div className="profile-name">
              {username}
            </div>

            <div className="profile-role">
              {isAdmin
                ? "Administrator"
                : "Security User"}
            </div>
          </div>

          <ChevronDown size={16} />
        </div>
      </div>
    </div>
  );
}

export default Topbar;