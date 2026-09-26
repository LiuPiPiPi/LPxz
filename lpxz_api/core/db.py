import sqlite3
from pathlib import Path

from flask import current_app, g


def get_db():
    if "db" not in g:
        db_path = Path(current_app.config["DATABASE"])
        db_path.parent.mkdir(parents=True, exist_ok=True)
        g.db = sqlite3.connect(db_path)
        g.db.row_factory = sqlite3.Row
        g.db.execute("PRAGMA foreign_keys = ON")
    return g.db


def close_db(_error=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_db():
    db = get_db()
    existing = db.execute("select name from sqlite_master where type='table' and name='user'").fetchone()
    if existing:
        return
    schema_path = Path(__file__).with_name("schema.sql")
    db.executescript(schema_path.read_text(encoding="utf-8"))
    db.commit()


def fetch_one(query, params=()):
    return get_db().execute(query, params).fetchone()


def fetch_all(query, params=()):
    return get_db().execute(query, params).fetchall()


def execute(query, params=()):
    db = get_db()
    cursor = db.execute(query, params)
    db.commit()
    return cursor


# 控制前台导航中各模块是否显示的开关，存为 site_setting 的 type=1 记录，
# 值为 "true"/"false" 字符串，经 /site 接口的 parse_json_value 解析为布尔值。
MODULE_SWITCH_DEFAULTS = [
    ("momentModuleEnabled", "动态模块显示", "true"),
    ("archiveModuleEnabled", "归档模块显示", "true"),
    ("friendModuleEnabled", "友链模块显示", "true"),
    ("aboutModuleEnabled", "关于模块显示", "true"),
]


def ensure_site_defaults():
    db = get_db()
    db.execute(
        """
        create table if not exists site_setting (
            id integer primary key autoincrement,
            name_en text not null,
            name_zh text,
            value text,
            type integer not null default 1
        )
        """
    )
    for name_en, name_zh, value in MODULE_SWITCH_DEFAULTS:
        existing = db.execute(
            "select id from site_setting where name_en = ?", (name_en,)
        ).fetchone()
        if not existing:
            db.execute(
                "insert into site_setting (name_en, name_zh, value, type) values (?, ?, ?, 1)",
                (name_en, name_zh, value),
            )
    db.commit()
