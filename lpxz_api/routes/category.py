from flask import request

from ..core.blueprints import admin_bp
from ..core.db import execute, fetch_all
from ..core.response import error, ok
from ..core.security import require_admin
from ..core.utils import get_json, paginate, rows_to_list
from ..serializers import page_payload, paginate_query


@admin_bp.get("/categoryAndTag")
@require_admin
def category_and_tag():
    categories = rows_to_list(fetch_all("select id, category_name as name from category order by id desc"))
    tags = rows_to_list(fetch_all("select id, tag_name as name, color from tag order by id desc"))
    return ok(data={"categories": categories, "tags": tags})


@admin_bp.get("/categories")
@require_admin
def categories():
    page_num, page_size, _offset = paginate(
        request.args.get("pageNum", 1), request.args.get("pageSize", 10)
    )
    rows = rows_to_list(fetch_all("select id, category_name as name from category order by id desc"))
    total, items = paginate_query(rows, page_num, page_size)
    return ok(data=page_payload(total, page_num, page_size, items))


@admin_bp.post("/category")
@require_admin
def create_category():
    payload = get_json()
    cursor = execute("insert into category (category_name) values (?)", (payload.get("name"),))
    return ok("添加成功", {"id": cursor.lastrowid})


@admin_bp.put("/category")
@require_admin
def update_category():
    payload = get_json()
    execute("update category set category_name = ? where id = ?", (payload.get("name"), payload.get("id")))
    return ok("修改成功")


@admin_bp.delete("/category")
@require_admin
def delete_category():
    execute("delete from category where id = ?", (request.args.get("id"),))
    return ok("删除成功")
