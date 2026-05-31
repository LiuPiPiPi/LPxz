import os
from pathlib import Path

from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parents[1]
ROOT_DIR = BASE_DIR.parent
load_dotenv(ROOT_DIR / ".env")


def _parse_bool(value, default=False):
    if value is None:
        return default
    return str(value).strip().lower() in {"1", "true", "yes", "on"}


def _resolve_database_path(raw_path):
    path = Path(raw_path)
    if path.is_absolute():
        return str(path)
    return str(BASE_DIR / path)


def _parse_origins(raw_value):
    values = [item.strip() for item in str(raw_value or "*").split(",") if item.strip()]
    return values or ["*"]


def _resolve_runtime_path(raw_path, default_value):
    path = Path(raw_path or default_value)
    if path.is_absolute():
        return str(path)
    return str(BASE_DIR / path)


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", SECRET_KEY)
    DATABASE = _resolve_database_path(os.getenv("SQLITE_DATABASE", "instance/lpxz.sqlite3"))
    SQLITE_BACKUP_DIR = _resolve_runtime_path(os.getenv("SQLITE_BACKUP_DIR"), "backups")
    FLASK_RUN_HOST = os.getenv("FLASK_RUN_HOST", "0.0.0.0")
    FLASK_RUN_PORT = int(os.getenv("FLASK_RUN_PORT", "8090"))
    CORS_ALLOWED_ORIGINS = _parse_origins(os.getenv("CORS_ALLOWED_ORIGINS", "*"))
    ENABLE_SCHEDULER = _parse_bool(os.getenv("ENABLE_SCHEDULER"), default=True)
    JSON_AS_ASCII = False
