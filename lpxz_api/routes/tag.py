from flask import request

from ..core.blueprints import admin_bp
from ..core.db import execute, fetch_all
from ..core.response import ok
from ..core.security import require_admin
from ..core.utils import get_json, paginate, rows_to_list
from ..serializers import page_payload, paginate_query


@admin_bp.get("/tags")
@require_admin
def tags():
    page_num, page_size, _offset = paginate(
        request.args.get("pageNum", 1), request.args.get("pageSize", 10)
    )
    rows = rows_to_list(fetch_all("select id, tag_name as name, color from tag order by id desc"))
    total, items = paginate_query(rows, page_num, page_size)
    return ok(data=page_payload(total, page_num, page_size, items))


@admin_bp.post("/tag")
@require_admin
def create_tag():
    payload = get_json()
    cursor = execute("insert into tag (tag_name, color) values (?, ?)", (payload.get("name"), payload.get("color")))
    return ok("添加成功", {"id": cursor.lastrowid})


@admin_bp.put("/tag")
@require_admin
def update_tag():
    payload = get_json()
    execute("update tag set tag_name = ?, color = ? where id = ?", (payload.get("name"), payload.get("color"), payload.get("id")))
    return ok("修改成功")


@admin_bp.delete("/tag")
@require_admin
def delete_tag():
    execute("delete from tag where id = ?", (request.args.get("id"),))
    return ok("删除成功")
