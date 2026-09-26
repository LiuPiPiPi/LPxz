from flask import request

from ..core.blueprints import admin_bp, public_bp
from ..core.db import execute, fetch_all, fetch_one
from ..core.response import error, ok
from ..core.security import require_admin
from ..core.utils import bool_int, get_json, now_text, paginate, render_markdown
from ..serializers import camelize_common_fields, page_payload, page_result


def attach_moment_flags(row):
    item = camelize_common_fields(dict(row))
    item["published"] = bool(item.pop("is_published", 0))
    return item


@admin_bp.get("/moments")
@require_admin
def admin_moments():
    page_num, page_size, offset = paginate(
        request.args.get("pageNum", 1), request.args.get("pageSize", 10)
    )
    total = fetch_one("select count(*) as total from moment")["total"]
    rows = fetch_all(
        "select * from moment order by gmt_create desc limit ? offset ?",
        (page_size, offset),
    )
    return ok(data=page_payload(total, page_num, page_size, [attach_moment_flags(row) for row in rows]))


@admin_bp.get("/moment")
@require_admin
def admin_moment():
    row = fetch_one("select * from moment where id = ?", (request.args.get("id"),))
    if row is None:
        return error("该动态不存在", 404)
    return ok(data=attach_moment_flags(row))


@admin_bp.post("/moment")
@require_admin
def create_moment():
    payload = get_json()
    cursor = execute(
        "insert into moment (content, likes, is_published, gmt_create) values (?, ?, ?, ?)",
        (payload.get("content"), int(payload.get("likes") or 0), bool_int(payload.get("published")), payload.get("gmtCreate") or now_text()),
    )
    return ok("添加成功", {"id": cursor.lastrowid})


@admin_bp.put("/moment")
@require_admin
def update_moment():
    payload = get_json()
    execute(
        "update moment set content = ?, likes = ?, is_published = ?, gmt_create = ? where id = ?",
        (payload.get("content"), int(payload.get("likes") or 0), bool_int(payload.get("published")), payload.get("gmtCreate") or now_text(), payload.get("id")),
    )
    return ok("更新成功")


@admin_bp.delete("/moment")
@require_admin
def delete_moment():
    execute("delete from moment where id = ?", (request.args.get("id"),))
    return ok("删除成功")


@admin_bp.put("/moment/published")
@require_admin
def update_moment_published():
    execute(
        "update moment set is_published = ? where id = ?",
        (bool_int(request.args.get("published") == "true"), request.args.get("id")),
    )
    return ok("操作成功")


@public_bp.get("/moments")
def moments():
    _page_num, page_size, offset = paginate(
        request.args.get("pageNum", 1), request.args.get("pageSize", 10)
    )
    total = fetch_one(
        """
        select count(*) as total
        from moment
        where is_published = 1
        """
    )["total"]
    rows = fetch_all(
        """
        select id, content, likes, is_published, gmt_create
        from moment
        where is_published = 1
        order by gmt_create desc
        limit ? offset ?
        """,
        (page_size, offset),
    )
    items = []
    for row in rows:
        item = camelize_common_fields(dict(row))
        item["content"] = render_markdown(item["content"])
        item["published"] = bool(item.pop("is_published"))
        items.append(item)
    return ok(data=page_result(total, page_size, items))


@public_bp.post("/moment/like/<int:moment_id>")
@public_bp.post("/moment/like")
def like_moment(moment_id=None):
    moment_id = moment_id or request.args.get("id") or (request.get_json(silent=True) or {}).get("id")
    execute("update moment set likes = likes + 1 where id = ?", (moment_id,))
    return ok("点赞成功")
