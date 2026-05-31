# LPxz Flask API

Lightweight Flask + SQLite backend for the LPxz blog API.

This version keeps the core content features and intentionally drops logs,
comments, Redis, Quartz, and Spring-specific infrastructure.

## Setup

项目配置统一来自根目录 `/.env`。

```bash
cd flask_api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
flask --app lpxz_api init-db
flask --app lpxz_api run --port 8090
```

## Scheduled backup

The API service includes a built-in scheduled job that backs up the SQLite
database every Monday at `08:00`.

- source database: `SQLITE_DATABASE`
- backup directory: `SQLITE_BACKUP_DIR`
- backup filename format: `{database_stem}_{YYYYMMDDHHMMSS}.sqlite3`

When using Docker Compose, backup files are written to
`flask_api/backups/` on the host.
