from flask import request

from ..core.blueprints import admin_bp
from ..core.db import execute, fetch_all
from ..core.response import ok
from ..core.security import require_admin
from ..core.utils import paginate, rows_to_list
from ..logging import log_page
from ..serializers import page_payload, paginate_query


@admin_bp.get("/operationLogs")
@require_admin
def operation_logs():
    page_num, page_size, offset = paginate(
        request.args.get("pageNum", 1), request.args.get("pageSize", 10)
    )
    total, items = log_page(
        "operation_log", "id", page_num, page_size, offset, request.args.get("date")
    )
    return ok(data=page_payload(total, page_num, page_size, items))


@admin_bp.delete("/operationLog")
@require_admin
def delete_operation_log():
    execute("delete from operation_log where id = ?", (request.args.get("id"),))
    return ok("删除成功")


@admin_bp.get("/loginLogs")
@require_admin
def login_logs():
    page_num, page_size, offset = paginate(
        request.args.get("pageNum", 1), request.args.get("pageSize", 10)
    )
    total, items = log_page("login_log", "id", page_num, page_size, offset, request.args.get("date"))
    return ok(data=page_payload(total, page_num, page_size, items))


@admin_bp.delete("/loginLog")
@require_admin
def delete_login_log():
    execute("delete from login_log where id = ?", (request.args.get("id"),))
    return ok("删除成功")


@admin_bp.get("/exceptionLogs")
@require_admin
def exception_logs():
    page_num, page_size, offset = paginate(
        request.args.get("pageNum", 1), request.args.get("pageSize", 10)
    )
    total, items = log_page(
        "exception_log", "id", page_num, page_size, offset, request.args.get("date")
    )
    return ok(data=page_payload(total, page_num, page_size, items))


@admin_bp.delete("/exceptionLog")
@require_admin
def delete_exception_log():
    execute("delete from exception_log where id = ?", (request.args.get("id"),))
    return ok("删除成功")


@admin_bp.get("/visitLogs")
@require_admin
def visit_logs():
    page_num, page_size, offset = paginate(
        request.args.get("pageNum", 1), request.args.get("pageSize", 10)
    )
    uuid = request.args.get("uuid", "")
    total, items = log_page(
        "visit_log",
        "id",
        page_num,
        page_size,
        offset,
        request.args.get("date"),
        "uuid = ?" if uuid else None,
        (uuid,) if uuid else (),
    )
    return ok(data=page_payload(total, page_num, page_size, items))


@admin_bp.delete("/visitLog")
@require_admin
def delete_visit_log():
    execute("delete from visit_log where id = ?", (request.args.get("id"),))
    return ok("删除成功")


@admin_bp.get("/visitors")
@require_admin
def visitors():
    page_num, page_size, offset = paginate(
        request.args.get("pageNum", 1), request.args.get("pageSize", 10)
    )
    rows = fetch_all(
        "select uuid, ip, ip_source as ipSource, os, browser, "
        "count(*) as pv, min(gmt_create) as gmtCreate "
        "from visit_log group by uuid order by gmtCreate desc"
    )
    items = rows_to_list(rows)
    total, page_items = paginate_query(items, page_num, page_size)
    return ok(data=page_payload(total, page_num, page_size, page_items))
