from flask import Blueprint, request

from ..db import execute, fetch_all, fetch_one, get_db
from ..log_service import log_page
from ..response import error, ok
from .. import scheduler as scheduler_service
from ..security import require_admin
from ..utils import bool_int, now_text, paginate, row_to_dict, rows_to_list

admin_bp = Blueprint("admin", __name__, url_prefix="/admin")


def get_json():
    return request.get_json(silent=True) or {}


def paginate_query(rows, page_num, page_size):
    total = len(rows)
    start = max(page_num - 1, 0) * page_size
    end = start + page_size
    return total, rows[start:end]


def page_payload(total, page_num, page_size, items):
    return {
        "total": total,
        "pages": (total + page_size - 1) // page_size if page_size else 0,
        "pageNum": page_num,
        "pageSize": page_size,
        "list": items,
    }


def camelize_common_fields(item):
    for snake, camel in (
        ("gmt_create", "gmtCreate"),
        ("gmt_modified", "gmtModified"),
        ("read_time", "readTime"),
    ):
        if snake in item:
            item[camel] = item.pop(snake)
    return item


def article_tags(article_id):
    rows = fetch_all(
        """
        select t.id, t.tag_name as name, t.color
        from article_tag at
        join tag t on t.id = at.tag_id
        where at.article_id = ?
        order by t.id desc
        """,
        (article_id,),
    )
    return rows_to_list(rows)


def attach_article_flags(row):
    item = camelize_common_fields(dict(row))
    item["published"] = bool(item.pop("is_published"))
    item["recommend"] = bool(item.pop("is_recommend"))
    item["appreciation"] = bool(item.pop("is_appreciation"))
    item["top"] = bool(item.pop("is_top"))
    if "category_name" in item:
        item["category"] = {"id": item.pop("category_id"), "name": item.pop("category_name")}
    item["tags"] = article_tags(item["id"])
    return item


def attach_moment_flags(row):
    item = camelize_common_fields(dict(row))
    item["published"] = bool(item.pop("is_published", 0))
    return item


def attach_friend_flags(row):
    item = camelize_common_fields(dict(row))
    item["published"] = bool(item.pop("is_published", 0))
    return item


def to_camel_setting(row):
    item = dict(row)
    item["nameEn"] = item.pop("name_en")
    item["nameZh"] = item.pop("name_zh")
    return item


def empty_page(page_num, page_size):
    return page_payload(0, page_num, page_size, [])


def resolve_category(payload):
    category_id = payload.get("categoryId")
    cate = payload.get("cate")
    if category_id:
        return category_id
    if isinstance(cate, int):
        return cate
    if isinstance(cate, str) and cate.strip():
        existing = fetch_one("select id from category where category_name = ?", (cate.strip(),))
        if existing:
            return existing["id"]
        return execute("insert into category (category_name) values (?)", (cate.strip(),)).lastrowid
    category = payload.get("category") or {}
    return category.get("id")


def resolve_tags(payload):
    raw_tags = payload.get("tagIds") or payload.get("tagList") or []
    tag_ids = []
    for tag in raw_tags:
        if isinstance(tag, int):
            tag_ids.append(tag)
        elif isinstance(tag, str) and tag.strip():
            name = tag.strip()
            existing = fetch_one("select id from tag where tag_name = ?", (name,))
            if existing:
                tag_ids.append(existing["id"])
            else:
                tag_ids.append(execute("insert into tag (tag_name) values (?)", (name,)).lastrowid)
        elif isinstance(tag, dict) and tag.get("id"):
            tag_ids.append(tag["id"])
    return tag_ids


def save_article_tags(article_id, tag_ids):
    db = get_db()
    db.execute("delete from article_tag where article_id = ?", (article_id,))
    db.executemany(
        "insert or ignore into article_tag (article_id, tag_id) values (?, ?)",
        [(article_id, tag_id) for tag_id in tag_ids],
    )
    db.commit()


@admin_bp.get("/articles")
@require_admin
def articles():
    title = request.args.get("title", "")
    category_id = request.args.get("categoryId")
    page_num, page_size, offset = paginate(
        request.args.get("pageNum", 1), request.args.get("pageSize", 10)
    )
    where = []
    params = []
    if title:
        where.append("a.title like ?")
        params.append(f"%{title}%")
    if category_id:
        where.append("a.category_id = ?")
        params.append(category_id)
    where_sql = f"where {' and '.join(where)}" if where else ""
    total = fetch_one(f"select count(*) as total from article a {where_sql}", params)["total"]
    rows = fetch_all(
        f"""
        select a.*, c.id as category_id, c.category_name
        from article a
        left join category c on c.id = a.category_id
        {where_sql}
        order by a.gmt_create desc
        limit ? offset ?
        """,
        (*params, page_size, offset),
    )
    categories = rows_to_list(fetch_all("select id, category_name as name from category order by id desc"))
    return ok(
        data={
            "articles": {
                "total": total,
                "pages": (total + page_size - 1) // page_size,
                "pageNum": page_num,
                "pageSize": page_size,
                "list": [attach_article_flags(row) for row in rows],
            },
            "categories": categories,
        }
    )


@admin_bp.get("/article")
@require_admin
def article():
    row = fetch_one(
        """
        select a.*, c.id as category_id, c.category_name
        from article a
        left join category c on c.id = a.category_id
        where a.id = ?
        """,
        (request.args.get("id"),),
    )
    if row is None:
        return error("该文章不存在", 404)
    return ok(data=attach_article_flags(row))


@admin_bp.post("/article")
@require_admin
def create_article():
    return upsert_article()


@admin_bp.put("/article")
@require_admin
def update_article():
    return upsert_article(update=True)


def upsert_article(update=False):
    payload = get_json()
    if not payload.get("title") or not payload.get("content") or not payload.get("description"):
        return error("参数有误")
    category_id = resolve_category(payload)
    tag_ids = resolve_tags(payload)
    created = payload.get("gmtCreate") or now_text()
    modified = now_text()
    words = int(payload.get("words") or len(payload.get("content", "")))
    read_time = int(payload.get("readTime") or round(words / 200) or 1)
    values = {
        "title": payload["title"],
        "cover": payload.get("cover"),
        "content": payload["content"],
        "description": payload["description"],
        "is_published": bool_int(payload.get("published")),
        "is_recommend": bool_int(payload.get("recommend")),
        "is_appreciation": bool_int(payload.get("appreciation")),
        "is_top": bool_int(payload.get("top")),
        "views": int(payload.get("views") or 0),
        "words": words,
        "read_time": read_time,
        "password": payload.get("password") or "",
        "category_id": category_id,
        "gmt_create": created,
        "gmt_modified": modified,
    }
    if update:
        article_id = payload.get("id")
        if not article_id:
            return error("文章 id 不能为空")
        execute(
            """
            update article
            set title=:title, cover=:cover, content=:content, description=:description,
                is_published=:is_published, is_recommend=:is_recommend,
                is_appreciation=:is_appreciation, is_top=:is_top, views=:views,
                words=:words, read_time=:read_time, password=:password,
                category_id=:category_id, gmt_create=:gmt_create, gmt_modified=:gmt_modified
            where id=:id
            """,
            {**values, "id": article_id},
        )
    else:
        cursor = execute(
            """
            insert into article (
                title, cover, content, description, is_published, is_recommend,
                is_appreciation, is_top, views, words, read_time, password,
                category_id, gmt_create, gmt_modified
            ) values (
                :title, :cover, :content, :description, :is_published, :is_recommend,
                :is_appreciation, :is_top, :views, :words, :read_time, :password,
                :category_id, :gmt_create, :gmt_modified
            )
            """,
            values,
        )
        article_id = cursor.lastrowid
    save_article_tags(article_id, tag_ids)
    return ok("保存成功", {"id": article_id})


@admin_bp.delete("/article")
@require_admin
def delete_article():
    execute("delete from article_tag where article_id = ?", (request.args.get("id"),))
    execute("delete from article where id = ?", (request.args.get("id"),))
    return ok("删除成功")


@admin_bp.put("/article/top")
@require_admin
def update_article_top():
    execute("update article set is_top = ? where id = ?", (bool_int(request.args.get("top") == "true"), request.args.get("id")))
    return ok("操作成功")


@admin_bp.put("/article/recommend")
@require_admin
def update_article_recommend():
    execute("update article set is_recommend = ? where id = ?", (bool_int(request.args.get("recommend") == "true"), request.args.get("id")))
    return ok("操作成功")


@admin_bp.put("/article/<int:article_id>/visibility")
@require_admin
def update_article_visibility(article_id):
    payload = get_json()
    execute(
        """
        update article
        set is_appreciation = ?, is_recommend = ?, is_top = ?, is_published = ?, password = ?
        where id = ?
        """,
        (
            bool_int(payload.get("appreciation")),
            bool_int(payload.get("recommend")),
            bool_int(payload.get("top")),
            bool_int(payload.get("published")),
            payload.get("password") or "",
            article_id,
        ),
    )
    return ok("操作成功")


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


@admin_bp.get("/jobs")
@require_admin
def jobs():
    page_num, page_size, offset = paginate(
        request.args.get("pageNum", 1), request.args.get("pageSize", 10)
    )
    total, items = scheduler_service.list_jobs(page_size, offset)
    return ok(data=page_payload(total, page_num, page_size, items))


@admin_bp.post("/job")
@require_admin
def create_job():
    try:
        job_id = scheduler_service.create_job(get_json())
    except ValueError as exc:
        return error(str(exc))
    return ok("添加成功", {"jobId": job_id})


@admin_bp.put("/job")
@require_admin
def update_job():
    try:
        scheduler_service.update_job(get_json())
    except ValueError as exc:
        return error(str(exc))
    return ok("更新成功")


@admin_bp.delete("/job")
@require_admin
def delete_job():
    scheduler_service.delete_job(request.args.get("jobId"))
    return ok("删除成功")


@admin_bp.post("/job/run")
@require_admin
def run_job():
    try:
        scheduler_service.run_job_once(request.args.get("jobId"))
    except ValueError as exc:
        return error(str(exc))
    except RuntimeError as exc:
        return error(str(exc), 500)
    return ok("执行成功")


@admin_bp.put("/job/status")
@require_admin
def update_job_status():
    try:
        scheduler_service.update_job_status(request.args.get("jobId"), request.args.get("status"))
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


@admin_bp.get("/webTitleSuffix")
def web_title_suffix():
    row = fetch_one("select value from site_setting where name_en = 'webTitleSuffix'")
    return ok(data=row["value"] if row else "")
