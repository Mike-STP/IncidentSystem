import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import type { Page } from "./components/Sidebar";
import Topbar from "./components/Topbar";
import DashboardPage from "./pages/DashboardPage";
import IncidentsPage from "./pages/IncidentsPage";
import UsersPage from "./pages/UsersPage";
import LogsPage from "./pages/LogsPage";
import { login } from "./services/api";

type SessionUser = {
  id: number;
  username: string;
  email: string;
  role: number;
  sessionId: string;
};

function App() {
  const [user, setUser] =
    useState<SessionUser | null>(() => {
      const storedUser =
        localStorage.getItem("sessionUser");

      if (!storedUser) {
        return null;
      }

      try {
        return JSON.parse(storedUser);
      } catch {
        localStorage.removeItem(
          "sessionUser"
        );
        localStorage.removeItem("sessionId");
        return null;
      }
    });

  const [currentPage, setCurrentPage] =
    useState<Page>("dashboard");

  const [username, setUsername] = useState("");
  const [password, setPassword] =
    useState("");

  const [loginLoading, setLoginLoading] =
    useState(false);

  const [loginError, setLoginError] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(
        "sessionUser",
        JSON.stringify(user)
      );

      localStorage.setItem(
        "sessionId",
        user.sessionId
      );
    }
  }, [user]);

  async function handleLogin() {
    if (!username.trim() || !password) {
      setLoginError(
        "Please enter your username and password."
      );
      return;
    }

    try {
      setLoginLoading(true);
      setLoginError("");

      const response = await login(
        username.trim(),
        password
      );

      setUser(response);
      setCurrentPage("dashboard");
      setPassword("");
    } catch {
      setLoginError(
        "Invalid username or password."
      );
    } finally {
      setLoginLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("sessionId");
    localStorage.removeItem("sessionUser");

    setUser(null);
    setUsername("");
    setPassword("");
    setCurrentPage("dashboard");
  }

  function handleNavigate(page: Page) {
    if (page === "users" && !isAdmin) {
      return;
    }

    setCurrentPage(page);
  }

  if (!user) {
    return (
      <div className="login-screen">
        <div className="login-background">
          <div className="login-grid" />
          <div className="ambient-light light-one" />
          <div className="ambient-light light-two" />

          <div className="login-terminal terminal-one">
            <span>SECURITY MONITOR</span>
            <br />
            SYSTEM ONLINE
            <br />
            AUTHENTICATION REQUIRED
          </div>

          <div className="login-terminal terminal-two">
            <span>NETWORK STATUS</span>
            <br />
            ENCRYPTED CHANNEL
            <br />
            TLS 1.3 / AES-256
          </div>

          <div className="login-figure">
            <div className="figure-head">
              <div className="figure-eye left" />
              <div className="figure-eye right" />
            </div>

            <div className="figure-body">
              <div className="figure-shoulder left" />
              <div className="figure-shoulder right" />
            </div>

            <div className="figure-laptop">
              <div className="laptop-screen">
                <div className="laptop-code">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>

              <div className="laptop-base" />
            </div>
          </div>
        </div>

        <div className="login-overlay">
          <div className="login-card">
            <div className="login-brand">
              <div className="login-brand-icon">
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 3L19 6V11C19 15.5 16.1 19.4 12 21C7.9 19.4 5 15.5 5 11V6L12 3Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.5 12L11.2 13.7L14.8 10.1"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div>
                <div className="login-brand-title">
                  IncidentSystem
                </div>

                <div className="login-brand-subtitle">
                  SECURITY OPERATIONS
                </div>
              </div>
            </div>

            <div className="login-heading">
              <div className="login-eyebrow">
                SECURE ACCESS
              </div>

              <h1>
                Welcome back
              </h1>

              <p>
                Authenticate to access the
                security operations console.
              </p>
            </div>

            <form
              className="login-form"
              onSubmit={(event) => {
                event.preventDefault();
                void handleLogin();
              }}
            >
              <div className="login-field">
                <label htmlFor="login-username">
                  USERNAME
                </label>

                <input
                  id="login-username"
                  type="text"
                  autoComplete="username"
                  placeholder="Enter username"
                  value={username}
                  onChange={(event) => {
                    setUsername(
                      event.target.value
                    );
                    setLoginError("");
                  }}
                />
              </div>

              <div className="login-field">
                <label htmlFor="login-password">
                  PASSWORD
                </label>

                <div className="password-wrapper">
                  <input
                    id="login-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="current-password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(event) => {
                      setPassword(
                        event.target.value
                      );
                      setLoginError("");
                    }}
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(
                        (current) => !current
                      )
                    }
                  >
                    {showPassword
                      ? "HIDE"
                      : "SHOW"}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="login-error">
                  <span className="login-error-icon">
                    !
                  </span>

                  {loginError}
                </div>
              )}

              <button
                className="login-button"
                type="submit"
                disabled={loginLoading}
              >
                <span>
                  {loginLoading
                    ? "AUTHENTICATING..."
                    : "AUTHENTICATE"}
                </span>

                <span className="login-arrow">
                  →
                </span>
              </button>
            </form>

            <div className="login-footer">
              <div>
                <span className="status-dot" />
                SYSTEM ONLINE
              </div>

              <span>
                Protected connection
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentUser = user;
  const isAdmin = currentUser.role === 0;

  function renderPage() {
    switch (currentPage) {
      case "incidents":
        return (
          <IncidentsPage
            isAdmin={isAdmin}
            username={currentUser.username}
          />
        );

      case "users":
        return isAdmin ? (
          <UsersPage
            username={currentUser.username}
          />
        ) : (
          <DashboardPage
            username={currentUser.username}
            isAdmin={isAdmin}
            onNavigate={handleNavigate}
          />
        );

      case "logs":
        return <LogsPage />;

      case "dashboard":
      default:
        return (
          <DashboardPage
            username={currentUser.username}
            isAdmin={isAdmin}
            onNavigate={handleNavigate}
          />
        );
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Sidebar
          isAdmin={isAdmin}
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      </aside>

      <main className="main-content">
        <header className="topbar">
          <Topbar
            username={currentUser.username}
            isAdmin={isAdmin}
            currentPage={currentPage}
          />
        </header>

        <div className="content-area">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App;