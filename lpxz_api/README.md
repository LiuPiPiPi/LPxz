# LPxz Flask API

Lightweight Flask + SQLite backend for the LPxz blog API.

This version keeps the core content features and intentionally drops logs,
comments, Redis, Quartz, and Spring-specific infrastructure.

## Setup

项目配置统一来自根目录 `/.env`。

> 包名 `lpxz_api` 需从仓库根目录解析，以下命令请在仓库根目录执行（不要 `cd lpxz_api`）。

```bash
python -m venv lpxz_api/.venv
source lpxz_api/.venv/bin/activate
pip install -r lpxz_api/requirements.txt
flask --app lpxz_api init-db
flask --app lpxz_api run --port 8090
```

## Scheduled backup

The API service includes a built-in scheduled job that backs up the SQLite
database every Monday at `08:00`.

- source database: `SQLITE_DATABASE`
- backup directory: `SQLITE_BACKUP_DIR`
- backup filename format: `{database_stem}_{YYYYMMDDHHMMSS}.sqlite3`

When using Docker Compose, backup files are written to the host's
`${LPXZ_DATA_DIR:-/var/lib/lpxz}/backups/` directory (the container path
`/app/backups` is volume-mounted from there).
