import json
import time
import traceback

from flask import request

from .db import execute, fetch_all, fetch_one
from .security import current_user
from .utils import now_text


OPERATION_DESCRIPTIONS = {
    "create_article": "发布文章",
    "update_article": "更新文章",
    "delete_article": "删除文章",
    "update_article_top": "更新文章置顶状态",
    "update_article_recommend": "更新文章推荐状态",
    "update_article_visibility": "更新文章可见性状态",
    "create_category": "添加分类",
    "update_category": "修改分类",
    "delete_category": "删除分类",
    "create_tag": "添加标签",
    "update_tag": "修改标签",
    "delete_tag": "删除标签",
    "create_moment": "发布动态",
    "update_moment": "更新动态",
    "delete_moment": "删除动态",
    "update_moment_published": "更新动态公开状态",
    "create_friend": "添加友链",
    "update_friend": "更新友链",
    "delete_friend": "删除友链",
    "update_friend_published": "更新友链公开状态",
    "update_friend_info_comment_enabled": "修改友链页面评论开放状态",
    "update_friend_info_content": "修改友链页面信息",
    "update_about": "修改关于我页面",
    "save_site_settings": "更新站点配置信息",
    "create_job": "新建定时任务",
    "update_job": "修改定时任务",
    "delete_job": "删除定时任务",
    "run_job": "立即执行定时任务",
    "update_job_status": "更新任务状态",
    "delete_operation_log": "删除操作日志",
    "delete_login_log": "删除登录日志",
    "delete_exception_log": "删除异常日志",
    "delete_visit_log": "删除访问日志",
    "delete_job_log": "删除定时任务日志",
}


VISIT_DESCRIPTIONS = {
    "articles": ("访问页面", "首页"),
    "article_detail": ("查看文章", ""),
    "check_article_password": ("校验文章密码", ""),
    "search_article": ("搜索文章", ""),
    "category_articles": ("查看分类", ""),
    "tag_articles": ("查看标签", ""),
    "archives": ("访问页面", "文章归档"),
    "friends": ("访问页面", "友链"),
    "add_friend_views": ("访问友链", ""),
    "moments": ("访问页面", "动态"),
    "like_moment": ("点赞动态", ""),
    "about": ("访问页面", "关于我"),
    "site": ("加载站点信息", ""),
}


def ensure_log_tables():
    execute(
        """
        create table if not exists operation_log (
            id integer primary key autoincrement,
            username text,
            uri text,
            method text,
            description text,
            ip text,
            ip_source text,
            os text,
            browser text,
            times integer,
            user_agent text,
            param text,
            gmt_create text
        )
        """
    )
    execute(
        """
        create table if not exists login_log (
            id integer primary key autoincrement,
            username text,
            ip text,
            ip_source text,
            os text,
            browser text,
            status integer,
            description text,
            user_agent text,
            gmt_create text
        )
        """
    )
    execute(
        """
        create table if not exists exception_log (
            id integer primary key autoincrement,
            uri text,
            method text,
            description text,
            error text,
            ip text,
            ip_source text,
            os text,
            browser text,
            user_agent text,
            param text,
            gmt_create text
        )
        """
    )
    execute(
        """
        create table if not exists visit_log (
            id integer primary key autoincrement,
            uuid text,
            uri text,
            method text,
            behavior text,
            content text,
            remark text,
            ip text,
            ip_source text,
            os text,
            browser text,
            user_agent text,
            param text,
            gmt_create text
        )
        """
    )
    execute(
        """
        create table if not exists schedule_job_log (
            log_id integer primary key autoincrement,
            job_id integer,
            bean_name text,
            method_name text,
            params text,
            status integer,
            error text,
            times integer,
            gmt_create text
        )
        """
    )


def client_ip():
    forwarded = request.headers.get("X-Forwarded-For", "")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.headers.get("X-Real-IP") or request.remote_addr or ""


def client_uuid():
    return (
        request.headers.get("identification")
        or request.cookies.get("identification")
        or request.args.get("uuid")
        or ""
    )


def user_agent_text():
    return request.headers.get("User-Agent", "")


def parse_os(user_agent):
    ua = user_agent.lower()
    if "windows" in ua:
        return "Windows"
    if "mac os" in ua or "macintosh" in ua:
        return "macOS"
    if "iphone" in ua or "ipad" in ua:
        return "iOS"
    if "android" in ua:
        return "Android"
    if "linux" in ua:
        return "Linux"
    return "Unknown"


def parse_browser(user_agent):
    ua = user_agent.lower()
    if "edg/" in ua:
        return "Edge"
    if "chrome/" in ua and "safari/" in ua:
        return "Chrome"
    if "firefox/" in ua:
        return "Firefox"
    if "safari/" in ua:
        return "Safari"
    return "Unknown"


def ip_source(ip):
    if ip in ("127.0.0.1", "::1", "localhost") or ip.startswith("192.168.") or ip.startswith("10."):
        return "内网IP"
    return "未知"


def request_param():
    parts = {}
    if request.args:
        parts["query"] = request.args.to_dict(flat=False)
    data = request.get_json(silent=True)
    if data:
        parts["body"] = data
    return json.dumps(parts, ensure_ascii=False) if parts else ""


def client_meta():
    ip = client_ip()
    ua = user_agent_text()
    return {
        "ip": ip,
        "ip_source": ip_source(ip),
        "os": parse_os(ua),
        "browser": parse_browser(ua),
        "user_agent": ua,
    }


def mark_request_start():
    request._lpxz_start_time = time.time()


def request_elapsed_ms():
    start = getattr(request, "_lpxz_start_time", None)
    if not start:
        return 0
    return int((time.time() - start) * 1000)


def save_login_log(username, status, description):
    ensure_log_tables()
    meta = client_meta()
    execute(
        """
        insert into login_log (username, ip, ip_source, os, browser, status, description, user_agent, gmt_create)
        values (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            username,
            meta["ip"],
            meta["ip_source"],
            meta["os"],
            meta["browser"],
            1 if status else 0,
            description,
            meta["user_agent"],
            now_text(),
        ),
    )


def save_operation_log(response=None):
    if not request.endpoint or not request.endpoint.startswith("admin."):
        return
    if request.method not in ("POST", "PUT", "DELETE"):
        return
    endpoint = request.endpoint.rsplit(".", 1)[-1]
    description = OPERATION_DESCRIPTIONS.get(endpoint)
    if not description:
        return

    ensure_log_tables()
    user = current_user()
    meta = client_meta()
    execute(
        """
        insert into operation_log
        (username, uri, method, description, ip, ip_source, os, browser, times, user_agent, param, gmt_create)
        values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            user["username"] if user else "",
            request.path,
            request.method,
            description,
            meta["ip"],
            meta["ip_source"],
            meta["os"],
            meta["browser"],
            request_elapsed_ms(),
            meta["user_agent"],
            request_param(),
            now_text(),
        ),
    )


def save_visit_log(response=None):
    if not request.endpoint or not request.endpoint.startswith("public."):
        return
    endpoint = request.endpoint.rsplit(".", 1)[-1]
    description = VISIT_DESCRIPTIONS.get(endpoint)
    if not description:
        return
    if response is not None and response.status_code >= 500:
        return

    ensure_log_tables()
    behavior, content = description
    meta = client_meta()
    execute(
        """
        insert into visit_log
        (uuid, uri, method, behavior, content, remark, ip, ip_source, os, browser, user_agent, param, gmt_create)
        values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            client_uuid(),
            request.path,
            request.method,
            behavior,
            content,
            "",
            meta["ip"],
            meta["ip_source"],
            meta["os"],
            meta["browser"],
            meta["user_agent"],
            request_param(),
            now_text(),
        ),
    )


def save_exception_log(exc):
    ensure_log_tables()
    meta = client_meta()
    endpoint = request.endpoint.rsplit(".", 1)[-1] if request.endpoint else ""
    description = OPERATION_DESCRIPTIONS.get(endpoint) or VISIT_DESCRIPTIONS.get(endpoint, ("", ""))[0]
    execute(
        """
        insert into exception_log
        (uri, method, description, error, ip, ip_source, os, browser, user_agent, param, gmt_create)
        values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            request.path,
            request.method,
            description,
            "".join(traceback.format_exception(type(exc), exc, exc.__traceback__)),
            meta["ip"],
            meta["ip_source"],
            meta["os"],
            meta["browser"],
            meta["user_agent"],
            request_param(),
            now_text(),
        ),
    )


def save_job_log(job_id=None, bean_name="", method_name="", params="", status=True, error="", times=0):
    ensure_log_tables()
    execute(
        """
        insert into schedule_job_log (job_id, bean_name, method_name, params, status, error, times, gmt_create)
        values (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (job_id, bean_name, method_name, params, 1 if status else 0, error, times, now_text()),
    )


def split_date_range(raw):
    if not raw:
        return None, None
    if isinstance(raw, (list, tuple)):
        raw = raw[0] if raw else ""
    parts = [part.strip() for part in str(raw).split(",") if part.strip()]
    if len(parts) != 2:
        return None, None
    return parts[0], parts[1]


def log_page(table, id_column, page_num, page_size, offset, date=None, extra_where=None, extra_params=()):
    ensure_log_tables()
    start_date, end_date = split_date_range(date)
    where = []
    params = []
    if start_date and end_date:
        where.append("gmt_create between ? and ?")
        params.extend([start_date, end_date])
    if extra_where:
        where.append(extra_where)
        params.extend(extra_params)
    where_sql = f"where {' and '.join(where)}" if where else ""
    total = fetch_one(f"select count(*) as total from {table} {where_sql}", params)["total"]
    rows = fetch_all(
        f"select * from {table} {where_sql} order by {id_column} desc limit ? offset ?",
        (*params, page_size, offset),
    )
    items = [dict(row) for row in rows]
    for item in items:
        item["gmtCreate"] = item.pop("gmt_create", None)
        if "ip_source" in item:
            item["ipSource"] = item.pop("ip_source")
        if "user_agent" in item:
            item["userAgent"] = item.pop("user_agent")
        if "log_id" in item:
            item["logId"] = item.pop("log_id")
        if "job_id" in item:
            item["jobId"] = item.pop("job_id")
        if "bean_name" in item:
            item["beanName"] = item.pop("bean_name")
        if "method_name" in item:
            item["methodName"] = item.pop("method_name")
        if "status" in item:
            item["status"] = bool(item["status"])
    return total, items
