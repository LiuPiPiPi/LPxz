from flask import request

from ..core.blueprints import admin_bp
from ..core.db import execute
from ..core.response import error, ok
from ..core.security import require_admin
from ..core.utils import get_json, paginate
from ..logging import log_page
from ..scheduler import (
    create_job as _create_job,
    delete_job as _delete_job,
    list_jobs as _list_jobs,
    run_job_once as _run_job_once,
    update_job as _update_job,
    update_job_status as _update_job_status,
)
from ..serializers import page_payload


@admin_bp.get("/jobs")
@require_admin
def jobs():
    page_num, page_size, offset = paginate(
        request.args.get("pageNum", 1), request.args.get("pageSize", 10)
    )
    total, items = _list_jobs(page_size, offset)
    return ok(data=page_payload(total, page_num, page_size, items))


@admin_bp.post("/job")
@require_admin
def create_job():
    try:
        job_id = _create_job(get_json())
    except ValueError as exc:
        return error(str(exc))
    return ok("添加成功", {"jobId": job_id})


@admin_bp.put("/job")
@require_admin
def update_job():
    try:
        _update_job(get_json())
    except ValueError as exc:
        return error(str(exc))
    return ok("更新成功")


@admin_bp.delete("/job")
@require_admin
def delete_job():
    _delete_job(request.args.get("jobId"))
    return ok("删除成功")


@admin_bp.post("/job/run")
@require_admin
def run_job():
    try:
        _run_job_once(request.args.get("jobId"))
    except ValueError as exc:
        return error(str(exc))
    except RuntimeError as exc:
        return error(str(exc), 500)
    return ok("执行成功")


@admin_bp.put("/job/status")
@require_admin
def update_job_status():
    try:
        _update_job_status(request.args.get("jobId"), request.args.get("status"))
    except ValueError as exc:
        return error(str(exc))
    return ok("操作成功")


@admin_bp.get("/job/logs")
@require_admin
def job_logs():
    page_num, page_size, offset = paginate(
        request.args.get("pageNum", 1), request.args.get("pageSize", 10)
    )
    total, items = log_page(
        "schedule_job_log", "log_id", page_num, page_size, offset, request.args.get("date")
    )
    return ok(data=page_payload(total, page_num, page_size, items))


@admin_bp.delete("/job/log")
@require_admin
def delete_job_log():
    execute("delete from schedule_job_log where log_id = ?", (request.args.get("logId"),))
    return ok("删除成功")
