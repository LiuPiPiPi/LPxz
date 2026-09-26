import json

from flask import request

from ..core.blueprints import admin_bp, public_bp
from ..core.db import execute, fetch_all, fetch_one
from ..core.response import error, ok
from ..core.security import require_admin
from ..core.utils import get_json, rows_to_list


def parse_json_value(value):
    if not value:
        return value
    try:
        return json.loads(value)
    except (TypeError, json.JSONDecodeError):
        return value


def to_camel_setting(row):
    item = dict(row)
    item["nameEn"] = item.pop("name_en")
    item["nameZh"] = item.pop("name_zh")
    return item


@admin_bp.get("/siteSettings")
@require_admin
def site_settings():
    rows = [to_camel_setting(row) for row in fetch_all("select * from site_setting order by type, id")]
    return ok(
        data={
            "type1": [row for row in rows if row["type"] == 1],
            "type2": [row for row in rows if row["type"] == 2],
            "type3": [row for row in rows if row["type"] == 3],
        }
    )


@admin_bp.post("/siteSettings")
@require_admin
def save_site_settings():
    payload = get_json()
    if isinstance(payload, list):
        items = payload
        delete_ids = []
    else:
        items = payload.get("items") or payload.get("settings") or []
        delete_ids = payload.get("deleteIds") or []
    for item in items:
        item_id = item.get("id")
        if item_id:
            execute(
                "update site_setting set value = ?, name_en = ?, name_zh = ?, type = ? where id = ?",
                (
                    item.get("value"),
                    item.get("nameEn") or item.get("name_en"),
                    item.get("nameZh") or item.get("name_zh"),
                    item.get("type"),
                    item_id,
                ),
            )
        else:
            execute(
                "insert into site_setting (name_en, name_zh, value, type) values (?, ?, ?, ?)",
                (
                    item.get("nameEn") or item.get("name_en"),
                    item.get("nameZh") or item.get("name_zh"),
                    item.get("value"),
                    item.get("type"),
                ),
            )
    for item_id in delete_ids:
        execute("delete from site_setting where id = ?", (item_id,))
    return ok("保存成功")


@admin_bp.get("/webTitleSuffix")
def web_title_suffix():
    row = fetch_one("select value from site_setting where name_en = 'webTitleSuffix'")
    return ok(data=row["value"] if row else "")


@public_bp.get("/site")
def site():
    rows = fetch_all("select name_en, name_zh, value, type from site_setting order by type, id")
    site_info = {}
    badges = []
    introduction = {"favorites": [], "rollText": []}
    for row in rows:
        name = row["name_en"]
        value = parse_json_value(row["value"])
        setting_type = row["type"]
        if setting_type == 1:
            site_info[name] = value
        elif setting_type == 2 and isinstance(value, dict):
            badges.append(value)
        elif setting_type == 3:
            if name == "favorite" and isinstance(value, dict):
                introduction.setdefault("favorites", []).append(value)
            elif name == "rollText":
                introduction["rollText"] = [part for part in str(value or "").splitlines() if part.strip()]
            else:
                introduction[name] = value

    category_list = rows_to_list(fetch_all("select id, category_name as name from category order by id"))
    category_num_list = [
        fetch_one(
            "select count(*) as total from article where is_published = 1 and category_id = ?",
            (category["id"],),
        )["total"]
        for category in category_list
    ]
    tag_list = rows_to_list(fetch_all("select id, tag_name as name, color from tag order by id desc"))
    return ok(
        data={
            "siteInfo": site_info,
            "badges": badges,
            "introduction": introduction,
            "categoryList": category_list,
            "categoryNumList": category_num_list,
            "tagList": tag_list,
        }
    )
