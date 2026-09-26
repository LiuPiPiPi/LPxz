from flask import request

from ..core.blueprints import admin_bp, public_bp
from ..core.db import execute, fetch_all, fetch_one
from ..core.response import error, ok
from ..core.security import require_admin
from ..core.utils import bool_int, get_json, now_text, paginate, render_markdown, rows_to_list
from ..serializers import camelize_common_fields, page_payload


def attach_friend_flags(row):
    item = camelize_common_fields(dict(row))
    item["published"] = bool(item.pop("is_published", 0))
    return item


@admin_bp.get("/friends")
@require_admin
def admin_friends():
    page_num, page_size, offset = paginate(
        request.args.get("pageNum", 1), request.args.get("pageSize", 10)
    )
    total = fetch_one("select count(*) as total from friend")["total"]
    rows = fetch_all(
        "select * from friend order by id desc limit ? offset ?",
        (page_size, offset),
    )
    return ok(data=page_payload(total, page_num, page_size, [attach_friend_flags(row) for row in rows]))


@admin_bp.post("/friend")
@require_admin
def create_friend():
    payload = get_json()
    cursor = execute(
        """
        insert into friend (nickname, description, website, avatar, is_published, views, gmt_create)
        values (?, ?, ?, ?, ?, ?, ?)
        """,
        (
            payload.get("nickname"),
            payload.get("description"),
            payload.get("website"),
            payload.get("avatar"),
            bool_int(payload.get("published")),
            int(payload.get("views") or 0),
            payload.get("gmtCreate") or now_text(),
        ),
    )
    return ok("添加成功", {"id": cursor.lastrowid})


@admin_bp.put("/friend")
@require_admin
def update_friend():
    payload = get_json()
    execute(
        """
        update friend
        set nickname = ?, description = ?, website = ?, avatar = ?, is_published = ?
        where id = ?
        """,
        (
            payload.get("nickname"),
            payload.get("description"),
            payload.get("website"),
            payload.get("avatar"),
            bool_int(payload.get("published")),
            payload.get("id"),
        ),
    )
    return ok("更新成功")


@admin_bp.delete("/friend")
@require_admin
def delete_friend():
    execute("delete from friend where id = ?", (request.args.get("id"),))
    return ok("删除成功")


@admin_bp.put("/friend/published")
@require_admin
def update_friend_published():
    execute(
        "update friend set is_published = ? where id = ?",
        (bool_int(request.args.get("published") == "true"), request.args.get("id")),
    )
    return ok("操作成功")


@admin_bp.get("/friendInfo")
@require_admin
def friend_info():
    content_row = fetch_one("select value from site_setting where name_en = 'friendContent'")
    enabled_row = fetch_one("select value from site_setting where name_en = 'friendCommentEnabled'")
    return ok(
        data={
            "content": content_row["value"] if content_row else "",
            "commentEnabled": bool(enabled_row and str(enabled_row["value"]).lower() in ("1", "true")),
        }
    )


@admin_bp.put("/friendInfo/commentEnabled")
@require_admin
def update_friend_info_comment_enabled():
    value = "true" if request.args.get("commentEnabled") == "true" else "false"
    row = fetch_one("select id from site_setting where name_en = 'friendCommentEnabled'")
    if row:
        execute("update site_setting set value = ? where id = ?", (value, row["id"]))
    else:
        execute(
            "insert into site_setting (name_en, name_zh, value, type) values (?, ?, ?, ?)",
            ("friendCommentEnabled", "友链评论开关", value, 1),
        )
    return ok("更新成功")


@admin_bp.put("/friendInfo/content")
@require_admin
def update_friend_info_content():
    payload = get_json()
    content = payload.get("content", "")
    row = fetch_one("select id from site_setting where name_en = 'friendContent'")
    if row:
        execute("update site_setting set value = ? where id = ?", (content, row["id"]))
    else:
        execute(
            "insert into site_setting (name_en, name_zh, value, type) values (?, ?, ?, ?)",
            ("friendContent", "友链内容", content, 1),
        )
    return ok("更新成功")


@public_bp.get("/friends")
def friends():
    rows = fetch_all(
        """
        select nickname, description, website, avatar
        from friend
        where is_published = 1
        order by random()
        """
    )
    info_row = fetch_one("select value from site_setting where name_en = 'friendContent'")
    return ok(
        data={
            "friendList": rows_to_list(rows),
            "friendInfo": {
                "content": render_markdown(info_row["value"] if info_row else ""),
                "commentEnabled": False,
            },
        }
    )


@public_bp.post("/friend")
def add_friend_views():
    nickname = request.args.get("nickname") or (request.get_json(silent=True) or {}).get("nickname")
    if nickname:
        execute("update friend set views = views + 1 where nickname = ?", (nickname,))
    return ok("操作成功")
