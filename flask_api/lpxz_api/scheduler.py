import sqlite3
import threading
import time
from datetime import datetime
from pathlib import Path

from flask import current_app

from .db import execute, fetch_all, fetch_one
from .log_service import ensure_log_tables, save_job_log
from .utils import now_text


_scheduler_app = None
_scheduler_thread = None
_stop_event = threading.Event()
_last_run = {}


def ensure_schedule_tables():
    ensure_log_tables()
    execute(
        """
        create table if not exists schedule_job (
            job_id integer primary key autoincrement,
            bean_name text not null,
            method_name text not null,
            params text,
            cron text not null,
            status integer not null default 0,
            remark text,
            gmt_create text
        )
        """
    )


def parse_bool(value):
    if isinstance(value, bool):
        return value
    if isinstance(value, int):
        return value != 0
    return str(value).lower() in ("1", "true", "yes", "on")


def job_to_dict(row):
    item = dict(row)
    item["jobId"] = item.pop("job_id")
    item["beanName"] = item.pop("bean_name")
    item["methodName"] = item.pop("method_name")
    item["gmtCreate"] = item.pop("gmt_create")
    item["status"] = bool(item["status"])
    return item


def parse_field(raw, min_value, max_value, allow_question=False):
    raw = str(raw).strip()
    if raw == "?" and allow_question:
        raw = "*"
    values = set()
    for part in raw.split(","):
        part = part.strip()
        if part == "*":
            values.update(range(min_value, max_value + 1))
        elif part.startswith("*/"):
            step = int(part[2:])
            values.update(range(min_value, max_value + 1, step))
        elif "-" in part:
            start, end = [int(value) for value in part.split("-", 1)]
            values.update(range(start, end + 1))
        else:
            values.add(int(part))
    if any(value < min_value or value > max_value for value in values):
        raise ValueError(f"cron字段超出范围：{raw}")
    return values


def parse_cron(cron):
    parts = str(cron or "").split()
    if len(parts) != 6:
        raise ValueError("cron表达式必须为6段，例如：0 0 1 * * ?")
    return {
        "second": parse_field(parts[0], 0, 59),
        "minute": parse_field(parts[1], 0, 59),
        "hour": parse_field(parts[2], 0, 23),
        "day": parse_field(parts[3], 1, 31, allow_question=True),
        "month": parse_field(parts[4], 1, 12),
        "weekday": parse_field(parts[5], 0, 7, allow_question=True),
    }


def cron_matches(cron, now):
    parsed = parse_cron(cron)
    # Quartz uses 1-7 for Sunday-Saturday. Python uses 0-6 for Monday-Sunday.
    quartz_weekday = 1 if now.weekday() == 6 else now.weekday() + 2
    return (
        now.second in parsed["second"]
        and now.minute in parsed["minute"]
        and now.hour in parsed["hour"]
        and now.day in parsed["day"]
        and now.month in parsed["month"]
        and (quartz_weekday in parsed["weekday"] or (quartz_weekday == 1 and 7 in parsed["weekday"]))
    )


def validate_job_payload(payload):
    bean_name = (payload.get("beanName") or payload.get("bean_name") or "").strip()
    method_name = (payload.get("methodName") or payload.get("method_name") or "").strip()
    params = payload.get("params") or ""
    cron = (payload.get("cron") or "").strip()
    remark = payload.get("remark") or ""
    if not bean_name or not method_name or not cron:
        raise ValueError("Bean、方法名和cron不能为空")
    parse_cron(cron)
    if (bean_name, method_name) not in TASK_REGISTRY:
        raise ValueError(f"未注册的任务：{bean_name}.{method_name}")
    return bean_name, method_name, params, cron, remark


def list_jobs(page_size, offset):
    ensure_schedule_tables()
    total = fetch_one("select count(*) as total from schedule_job")["total"]
    rows = fetch_all(
        """
        select job_id, bean_name, method_name, params, cron, status, remark, gmt_create
        from schedule_job
        order by job_id desc
        limit ? offset ?
        """,
        (page_size, offset),
    )
    return total, [job_to_dict(row) for row in rows]


def get_job(job_id):
    ensure_schedule_tables()
    row = fetch_one(
        """
        select job_id, bean_name, method_name, params, cron, status, remark, gmt_create
        from schedule_job
        where job_id = ?
        """,
        (job_id,),
    )
    return job_to_dict(row) if row else None


def create_job(payload):
    bean_name, method_name, params, cron, remark = validate_job_payload(payload)
    cursor = execute(
        """
        insert into schedule_job (bean_name, method_name, params, cron, status, remark, gmt_create)
        values (?, ?, ?, ?, 0, ?, ?)
        """,
        (bean_name, method_name, params, cron, remark, now_text()),
    )
    return cursor.lastrowid


def update_job(payload):
    job_id = payload.get("jobId") or payload.get("job_id")
    if not job_id:
        raise ValueError("任务ID不能为空")
    bean_name, method_name, params, cron, remark = validate_job_payload(payload)
    cursor = execute(
        """
        update schedule_job
        set bean_name = ?, method_name = ?, params = ?, cron = ?, status = 0, remark = ?
        where job_id = ?
        """,
        (bean_name, method_name, params, cron, remark, job_id),
    )
    if cursor.rowcount == 0:
        raise ValueError("任务不存在")


def delete_job(job_id):
    ensure_schedule_tables()
    execute("delete from schedule_job where job_id = ?", (job_id,))
    _last_run.pop(str(job_id), None)


def update_job_status(job_id, status):
    ensure_schedule_tables()
    status = parse_bool(status)
    cursor = execute("update schedule_job set status = ? where job_id = ?", (1 if status else 0, job_id))
    if cursor.rowcount == 0:
        raise ValueError("任务不存在")
    if not status:
        _last_run.pop(str(job_id), None)


def sync_article_views_to_database(params=""):
    # Flask版当前未接入Redis，文章访问量已直接写数据库；保留该任务用于兼容老框架配置。
    return None


def sync_visit_info_to_database(params=""):
    # Flask版当前访问日志直接落库；保留该任务用于兼容老框架配置。
    return None


def backup_sqlite_database(params=""):
    db_path = Path(current_app.config["DATABASE"])
    if not db_path.exists():
        raise FileNotFoundError(f"SQLite database not found: {db_path}")

    backup_dir = Path(current_app.config["SQLITE_BACKUP_DIR"])
    backup_dir.mkdir(parents=True, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    backup_path = backup_dir / f"{db_path.stem}_{timestamp}{db_path.suffix}"

    source = sqlite3.connect(db_path)
    try:
        destination = sqlite3.connect(backup_path)
        try:
            source.backup(destination)
        finally:
            destination.close()
    finally:
        source.close()

    return str(backup_path)


TASK_REGISTRY = {
    ("redisSyncScheduleTask", "syncArticleViewsToDatabase"): sync_article_views_to_database,
    ("visitorSyncScheduleTask", "syncVisitInfoToDatabase"): sync_visit_info_to_database,
    ("sqliteBackupScheduleTask", "backupSqliteDatabase"): backup_sqlite_database,
}


def execute_job(job):
    started = time.time()
    status = True
    error = ""
    try:
        task = TASK_REGISTRY[(job["beanName"], job["methodName"])]
        task(job.get("params") or "")
    except Exception as exc:
        status = False
        error = str(exc)
    finally:
        save_job_log(
            job["jobId"],
            job["beanName"],
            job["methodName"],
            job.get("params") or "",
            status,
            error,
            int((time.time() - started) * 1000),
        )
    if not status:
        raise RuntimeError(error)


def run_job_once(job_id):
    job = get_job(job_id)
    if not job:
        raise ValueError("任务不存在")
    execute_job(job)


def ensure_default_job(bean_name, method_name, cron, status, remark, params=""):
    ensure_schedule_tables()
    existing = fetch_one(
        """
        select job_id from schedule_job
        where bean_name = ? and method_name = ?
        limit 1
        """,
        (bean_name, method_name),
    )
    if existing:
        return
    execute(
        """
        insert into schedule_job (bean_name, method_name, params, cron, status, remark, gmt_create)
        values (?, ?, ?, ?, ?, ?, ?)
        """,
        (bean_name, method_name, params, cron, status, remark, now_text()),
    )


def ensure_default_jobs():
    ensure_default_job(
        "redisSyncScheduleTask",
        "syncArticleViewsToDatabase",
        "0 0 1 * * *",
        1,
        "每天凌晨一点，从Redis将文章浏览量同步到数据库",
    )
    ensure_default_job(
        "visitorSyncScheduleTask",
        "syncVisitInfoToDatabase",
        "0 0 0 * * *",
        0,
        "清空当天Redis访客标识，记录当天的PV和UV，更新访客统计",
    )
    ensure_default_job(
        "sqliteBackupScheduleTask",
        "backupSqliteDatabase",
        "0 0 8 * * 2",
        1,
        "每周一早上八点备份 SQLite 数据库到备份目录",
    )


def scheduler_loop():
    while not _stop_event.wait(1):
        if _scheduler_app is None:
            continue
        with _scheduler_app.app_context():
            now = __import__("datetime").datetime.now()
            rows = fetch_all(
                """
                select job_id, bean_name, method_name, params, cron, status, remark, gmt_create
                from schedule_job
                where status = 1
                """
            )
            for row in rows:
                job = job_to_dict(row)
                job_key = str(job["jobId"])
                run_key = now.strftime("%Y-%m-%d %H:%M:%S")
                try:
                    if cron_matches(job["cron"], now) and _last_run.get(job_key) != run_key:
                        _last_run[job_key] = run_key
                        execute_job(job)
                except Exception:
                    pass


def start_scheduler(app):
    global _scheduler_app, _scheduler_thread
    _scheduler_app = app
    with app.app_context():
        ensure_default_jobs()
    if app.config.get("TESTING"):
        return
    if _scheduler_thread and _scheduler_thread.is_alive():
        return
    _stop_event.clear()
    _scheduler_thread = threading.Thread(target=scheduler_loop, name="lpxz-scheduler", daemon=True)
    _scheduler_thread.start()
