const USER_API_URL = "http://localhost:5053";
const INCIDENT_API_URL = "http://localhost:5220";
const LOGGING_API_URL = "http://localhost:5231";

// =========================================================
// Authentication
// =========================================================

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  role: number;
  sessionId: string;
}

export async function login(
  username: string,
  password: string
): Promise<LoginResponse> {
  const request: LoginRequest = {
    username,
    password,
  };

  const response = await fetch(
    `${USER_API_URL}/api/users/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Invalid username or password."
    );
  }

  return response.json();
}

// =========================================================
// Session
// =========================================================

function getSessionHeaders(): HeadersInit {
  return {
    "X-Session-Id":
      localStorage.getItem("sessionId") ?? "",
  };
}

// =========================================================
// Users
// =========================================================

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: number;
  isActive: boolean;
}

export async function getUsers(): Promise<User[]> {
  const response = await fetch(
    `${USER_API_URL}/api/users`,
    {
      headers: getSessionHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load users."
    );
  }

  return response.json();
}

export async function getUser(
  id: number
): Promise<User> {
  const response = await fetch(
    `${USER_API_URL}/api/users/${id}`,
    {
      headers: getSessionHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load user."
    );
  }

  return response.json();
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  role: number;
  isActive: boolean;
}

export async function createUser(
  user: CreateUserRequest
): Promise<User> {
  const response = await fetch(
    `${USER_API_URL}/api/users`,
    {
      method: "POST",
      headers: {
        ...getSessionHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to create user."
    );
  }

  return response.json();
}

export async function updateUser(
  id: number,
  user: CreateUserRequest
): Promise<User> {
  const response = await fetch(
    `${USER_API_URL}/api/users/${id}`,
    {
      method: "PUT",
      headers: {
        ...getSessionHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to update user."
    );
  }

  return response.json();
}

export async function changeUserStatus(
  id: number,
  isActive: boolean
): Promise<User> {
  const response = await fetch(
    `${USER_API_URL}/api/users/${id}/status?isActive=${isActive}`,
    {
      method: "PUT",
      headers: getSessionHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to change user status."
    );
  }

  return response.json();
}

// =========================================================
// Incidents
// =========================================================

export interface Incident {
  id: number;
  title: string;
  description: string;
  severity: number;
  status: number;
  cve: string | null;
  system: string;
  createdAt: string;
  updatedAt: string;
  reporter: string;
  assignee: string | null;
  escalation: number;
}

export async function getIncidents(): Promise<
  Incident[]
> {
  const response = await fetch(
    `${INCIDENT_API_URL}/api/incidents`,
    {
      headers: getSessionHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load incidents."
    );
  }

  return response.json();
}

export async function getIncident(
  id: number
): Promise<Incident> {
  const response = await fetch(
    `${INCIDENT_API_URL}/api/incidents/${id}`,
    {
      headers: getSessionHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load incident."
    );
  }

  return response.json();
}

export interface IncidentRequest {
  title: string;
  description: string;
  severity: number;
  cve: string | null;
  system: string;
  reporter: string;
  assignee: string | null;
}

export async function createIncident(
  incident: IncidentRequest
): Promise<Incident> {
  const response = await fetch(
    `${INCIDENT_API_URL}/api/incidents`,
    {
      method: "POST",
      headers: {
        ...getSessionHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(incident),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to create incident."
    );
  }

  return response.json();
}

export async function updateIncident(
  id: number,
  incident: IncidentRequest
): Promise<Incident> {
  const response = await fetch(
    `${INCIDENT_API_URL}/api/incidents/${id}`,
    {
      method: "PUT",
      headers: {
        ...getSessionHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(incident),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to update incident."
    );
  }

  return response.json();
}

export async function closeIncident(
  id: number
): Promise<void> {
  const response = await fetch(
    `${INCIDENT_API_URL}/api/incidents/${id}/close`,
    {
      method: "PUT",
      headers: getSessionHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to close incident."
    );
  }
}

export async function escalateIncident(
  id: number
): Promise<void> {
  const response = await fetch(
    `${INCIDENT_API_URL}/api/incidents/${id}/escalate`,
    {
      method: "PUT",
      headers: getSessionHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to escalate incident."
    );
  }
}

// =========================================================
// Logging
// =========================================================

export interface LogEntry {
  id: number;
  timestamp: string;
  level: string;
  message: string;
  source: string;
}

export async function getLogs(): Promise<
  LogEntry[]
> {
  const response = await fetch(
    `${LOGGING_API_URL}/api/logs`,
    {
      headers: getSessionHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load logs."
    );
  }

  return response.json();
}

export async function getLog(
  id: number
): Promise<LogEntry> {
  const response = await fetch(
    `${LOGGING_API_URL}/api/logs/${id}`,
    {
      headers: getSessionHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load log."
    );
  }

  return response.json();
}

export interface CreateLogRequest {
  level: string;
  message: string;
  source: string;
}

export async function createLog(
  log: CreateLogRequest
): Promise<LogEntry> {
  const response = await fetch(
    `${LOGGING_API_URL}/api/logs`,
    {
      method: "POST",
      headers: {
        ...getSessionHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(log),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to create log."
    );
  }

  return response.json();
}