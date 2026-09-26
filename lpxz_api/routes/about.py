from flask import request

from ..core.blueprints import admin_bp, public_bp
from ..core.db import execute, fetch_all, fetch_one
from ..core.response import error, ok
from ..core.security import require_admin
from ..core.utils import get_json, render_markdown


@admin_bp.get("/about")
@require_admin
def admin_about():
    rows = fetch_all("select * from about order by id")
    data = {"commentEnabled": False}
    for row in rows:
        key = row["name_en"]
        value = row["value"]
        if key == "commentEnabled":
            data[key] = str(value).lower() in ("1", "true")
        else:
            data[key] = value
    return ok(data=data)


@admin_bp.put("/about")
@require_admin
def update_about():
    payload = get_json()
    items = payload if isinstance(payload, list) else [
        {"name_en": key, "value": payload[key]} for key in ("title", "musicId", "commentEnabled", "content") if key in payload
    ]
    for item in items:
        name_en = item.get("nameEn") or item.get("name_en")
        value = item.get("value")
        if name_en == "commentEnabled":
            value = "true" if bool(value) else "false"
        existing = fetch_one("select id from about where name_en = ?", (name_en,))
        if existing:
            execute("update about set value = ? where name_en = ?", (value, name_en))
        else:
            execute(
                "insert into about (name_en, name_zh, value) values (?, ?, ?)",
                (name_en, name_en, value),
            )
    return ok("更新成功")


@public_bp.get("/about")
def about():
    rows = fetch_all("select name_en, name_zh, value from about")
    data = {row["name_en"]: row["value"] for row in rows}
    if "content" in data:
        data["content"] = render_markdown(data["content"])
    return ok(data=data)
