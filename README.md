

# IncidentSystem

## First-Time Setup & Usage

### 1. Start the application

Make sure Docker is running and open a terminal in the root directory of the project.

Start the application with:

```
docker compose up -d --build
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
