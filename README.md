

# IncidentSystem

[![Version](https://badgen.net/badge/version/1.0.0/blue)](https://github.com/Mike-STP/IncidentSystem#version)
[![Docker](https://badgen.net/badge/docker/compose/blue)](https://github.com/Mike-STP/IncidentSystem/blob/main/docker-compose.yml)
[![SAST](https://badgen.net/badge/SAST/Semgrep/green)](https://github.com/Mike-STP/IncidentSystem#sast---semgrep)
[![Incident API](https://badgen.net/badge/API/Incident/blue)](https://github.com/Mike-STP/IncidentSystem/tree/main/src/IncidentSystem.Api)
[![User API](https://badgen.net/badge/API/User%20Authentication/blue)](https://github.com/Mike-STP/IncidentSystem/tree/main/src/UserAuthentication.Api)
[![Logging API](https://badgen.net/badge/API/Logging/blue)](https://github.com/Mike-STP/IncidentSystem/tree/main/src/Logging.Api)
[![License](https://badgegen.net/badge/License/MIT/green)](https://github.com/Mike-STP/IncidentSystem/tree/main/License)

## Installation

### 1. Clone the repository

Clone the project repository from GitHub:

```text
git clone https://github.com/Mike-STP/IncidentSystem.git
```

After cloning, change into the project directory:

```text
cd IncidentSystem
```

The project is now available locally. The application can be started using Docker Compose as described in the following section.

## First-Time Setup & Usage

### 1. Start the application

Make sure Docker is running and open a terminal in the root directory of the project.

Start the application with:

```
docker compose up -d 
```

This builds the required Docker images and starts the complete application environment.

The status of the containers can be checked with:

```
docker compose ps
```

### 2. Open the application

Once the application is running, open:

```
http://localhost:5173
```

### 3. Initial administrator account

For a new installation, the application automatically creates an initial administrator account if no users exist in the database.

| Field | Value |
|---|---|
| Username | `admin` |
| Password | `Admin123!` |
| Role | `Admin` |

After logging in, the administrator can manage users and use the administrative functions of the application.

### 4. Stop the application

To stop the application:

```
docker compose down
```

The application data is stored in persistent Docker volumes and is retained when the containers are stopped and recreated.

To start the application again:

```
docker compose up -d
```



## Features
### Incident Management
The Incident Management feature allows users to create and manage security incidents. Each incident contains information such as title, description, severity, status, CVE, affected systems, reporter assignee. Users can vew all incidents or retrieve an incident by its ID. Furthermore, incidents can be updated, closed and escalated through different escalation levels

### Authentication
The Authentication feature allows users to log in using their username and password. During login, the system checks whether the user exists, whether the account is active and whether the provided password matches the stored password hash. After a successful login, a unique session ID is generated and returned to the client. This session is then stored in Redis and automatically expires after one hour. 

### Authorization
The Authorization feature controls access to the protected functions of the app. The session ID is sent with requests by using the "X-Session-Id" http header. The system checks the session that is stored in Redis and verifies the users role before allowing access to administrative functions.

### User Management
The User Management feature allows admins to manage users of the system. Users have a username, email address, role and active status. Accounts can also be enabled or disabled without deleting them from the database. These administrative functions are protected using role-based access control.

### Logging
The Logging feature provides information such as the timestamp, log level and message that can be stored for the application monitoring and troubleshooting. Redis is used to store the application log data.

### Database & Persistence
The system uses SQL Server for persistent storage of the incidents and user data. To access the relational databases and manage database migrations, Entity Framework is used. As mentioned, Redis is used for session management and application log data.

### REST APIs
The system provides RESTful APIs for communication between the frontend and the backend services. the APIs provide endpoints for incident management, user authentication, user management and application logging.

### Web Frontend
The Web Frontend provides the user interface for the Incident Management System. Users can use the frontend to access the available incident management and administrative functions.

### DOcker Deployment
The deploy the complete application Docker Compose and be used. The system consists of seperate containers for the frontend, backend APIs, SQL Server databases and Redis. THis allows the individual services and their dependencies to be deployed and run together as one app.

## System Requirements
The following software and system requirements and needed to run the application:
### Operating System
The app can be run on WIndows, Linux or macOS, as long as Docker and Docker Compose are supported.
### Docker
Docker is required to build an run the application containers. Docker compose is used to start and to manage the complete app environment.
### Web Browser
A modern web browser is needed to access the web frontend.
The application can be accessed at: http://localhost:5173
### Database and Storage
The application requires SQL Server for persistent storage and Redis for session and logging data. Both database services and Redis are started automatically through Docker Compose.
### .NET
The backend APIs are developed using ASP.NET Core and Entity Framework Core. However, the required .NET runtime is provided through the Docker containers, so a seperate .NET installation on the host system is not required.



## Services Overview

Once the application has been started successfully, the following services are running:

| Service | Purpose | Access |
|---|---|---|
| Frontend | Main web interface for the Incident Management System. | `http://localhost:5173` |
| Incident API | Handles security incident management. | `http://localhost:5220` |
| User Authentication API | Handles user management, authentication and sessions. | `http://localhost:5053` |
| Logging API | Handles application logging. | `http://localhost:5231` |
| Incident SQL Server | Stores incident-related data in the relational database. | `localhost:1433` |
| User SQL Server | Stores user-related data in the relational database. | `localhost:1434` |
| Redis | Stores sessions and application log data. | `localhost:6379` |


## ER Diagram
<img width="629" height="315" alt="image" src="https://github.com/user-attachments/assets/b8cbdc23-c003-42d2-b6f3-b7b307d130cd" />


## SAST - Semgrep

```text

docker run --rm -v "$(pwd):/src" returntocorp/semgrep semgrep --config auto
┌─────────────┐
│ Scan Status │
└─────────────┘
Scanning 88 files tracked by git with 1074 Code rules:

Language      Rules   Files          Origin      Rules
─────────────────────────────        ───────────────────
<multilang>      60      88          Community    1074
csharp           33      35
json              4      14
ts              163      12
yaml             35       4
dockerfile        6       4
js              153       1
html              1       1


┌──────────────┐
│ Scan Summary │
└──────────────┘
✅ Scan completed successfully.
• Findings: 3 (3 blocking)
• Rules run: 298
• Targets scanned: 88
• Parsed lines: ~99.9%
• Scan was limited to files tracked by git
• For a detailed list of skipped files and lines, run semgrep with the --verbose flag
Ran 298 rules on 88 files: 3 findings.
```

## Version
Current version: 1.0.0
This project is currently in version 1. Future updates and additional features can be added, which result in an increase of the version number.

## License
This project is licensed under the MIT License.

## Contributors
- Mike Stepien / is251024
- Alisa Mohammad Nejad / is251011

## Roadmap
Future improvements and extensions of the project may include:
### User and Role Management
- a more detailed role and permission management for different types of users
- a more restricted user management and administrative functions based on the user roles
- an improvement of the administrative interface for creating, editing, enabling/disabling users
### Incident Management
- adding filtering and searching for incidents based on their severity/status/escalation level
- an improvement of the escalation process and allowing different escalation rules
### Security
- an improvement in handling of sensitive configuration data such as passwords and connection strings
- adding additional security checks and automated security testing
### Web Frontend
- an improvement of the user interface and usability of the incident management system
- adding dashboards for an overview of incidents, their status and severity
### Testing and Deployment
- adding automated tests for the APIs and services
- extending the existing SAST checks and integrating them into the development workflow


## Git Repository
The source code of the project is available on GitHub: https://github.com/Mike-STP/IncidentSystem
