from collections import defaultdict

from flask import request

from ..core.blueprints import admin_bp, public_bp
from ..core.db import execute, fetch_all, fetch_one, get_db
from ..core.response import error, ok
from ..core.security import require_admin
from ..core.utils import bool_int, get_json, now_text, paginate, render_markdown
from ..serializers import article_tags, camelize_common_fields, page_result

PRIVATE_ARTICLE_DESCRIPTION = "此文章受密码保护。"


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


def article_summary(row):
    item = camelize_common_fields(dict(row))
    item["category"] = {"id": item.pop("category_id"), "name": item.pop("category_name")}
    item["top"] = bool(item.pop("is_top"))
    item["privacy"] = bool(item.get("password"))
    if item["privacy"]:
        item["password"] = ""
        item["description"] = PRIVATE_ARTICLE_DESCRIPTION
    else:
        item["description"] = render_markdown(item["description"])
    item["tags"] = article_tags(item["id"])
    return item


def article_page(where_sql="", params=()):
    _page_num, page_size, offset = paginate(
        request.args.get("pageNum", 1), request.args.get("pageSize", 10)
    )
    base_where = "a.is_published = 1"
    if where_sql:
        base_where += f" and {where_sql}"
    count_row = fetch_one(
        f"select count(*) as total from article a left join category c on c.id = a.category_id where {base_where}",
        params,
    )
    rows = fetch_all(
        f"""
        select a.id, a.title, a.description, a.is_top, a.views, a.words, a.read_time,
               a.password, a.gmt_create, a.gmt_modified,
               c.id as category_id, c.category_name
        from article a
        left join category c on c.id = a.category_id
        where {base_where}
        order by a.is_top desc, a.gmt_create desc
        limit ? offset ?
        """,
        (*params, page_size, offset),
    )
    return page_result(count_row["total"], page_size, [article_summary(row) for row in rows])


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
    categories = [{"id": r["id"], "name": r["category_name"]} for r in fetch_all("select id, category_name from category order by id desc")]
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


@public_bp.get("/articles")
def pub_articles():
    return ok(data=article_page())


@public_bp.get("/article")
def article_detail():
    article_id = request.args.get("id")
    row = fetch_one(
        """
        select a.*, c.id as category_id, c.category_name
        from article a
        left join category c on c.id = a.category_id
        where a.id = ? and a.is_published = 1
        """,
        (article_id,),
    )
    if row is None:
        return error("该文章不存在", 404)
    execute("update article set views = views + 1 where id = ?", (article_id,))
    item = camelize_common_fields(dict(row))
    item["content"] = render_markdown(item["content"])
    item["category"] = {"id": item.pop("category_id"), "name": item.pop("category_name")}
    item["tags"] = article_tags(article_id)
    item["published"] = bool(item.pop("is_published"))
    item["recommend"] = bool(item.pop("is_recommend"))
    item["appreciation"] = bool(item.pop("is_appreciation"))
    item["top"] = bool(item.pop("is_top"))
    return ok(data=item)


@public_bp.post("/checkArticlePassword")
def check_article_password():
    data = request.get_json(silent=True) or {}
    article_id = data.get("articleId")
    password = data.get("password", "")
    row = fetch_one("select password from article where id = ?", (article_id,))
    if row is None:
        return error("该文章不存在", 404)
    if row["password"] != password:
        return error("密码错误", 403)
    return ok("密码正确", str(article_id))


@public_bp.get("/searchArticle")
def search_article():
    query = request.args.get("query", "").strip()
    if not query:
        return ok(data=[])
    pattern = f"%{query}%"
    rows = fetch_all(
        """
        select id, title, content
        from article
        where is_published = 1
          and coalesce(password, '') = ''
          and (title like ? or content like ?)
        order by
          case when title like ? then 0 else 1 end,
          gmt_create desc
        """,
        (pattern, pattern, pattern),
    )
    results = []
    lower_query = query.lower()
    for row in rows:
        item = dict(row)
        content = item.get("content") or ""
        lower_content = content.lower()
        match_index = lower_content.find(lower_query)
        index = max(match_index - 10, 0) if match_index >= 0 else 0
        item["content"] = content[index : index + 60]
        item["matchType"] = "title" if lower_query in (item.get("title") or "").lower() else "content"
        results.append(item)
    return ok(data=results)


@public_bp.get("/category")
def category_articles():
    name = request.args.get("categoryName") or request.args.get("name")
    if not name:
        return error("分类不能为空")
    return ok(data=article_page("c.category_name = ?", (name,)))


@public_bp.get("/tag")
def tag_articles():
    name = request.args.get("tagName") or request.args.get("name")
    if not name:
        return error("标签不能为空")
    _page_num, page_size, offset = paginate(
        request.args.get("pageNum", 1), request.args.get("pageSize", 10)
    )
    count_row = fetch_one(
        """
        select count(*) as total
        from article a
        join article_tag at on at.article_id = a.id
        join tag t on t.id = at.tag_id
        where a.is_published = 1 and t.tag_name = ?
        """,
        (name,),
    )
    rows = fetch_all(
        """
        select a.id, a.title, a.description, a.is_top, a.views, a.words, a.read_time,
               a.password, a.gmt_create, a.gmt_modified,
               c.id as category_id, c.category_name
        from article a
        join article_tag at on at.article_id = a.id
        join tag t on t.id = at.tag_id
        left join category c on c.id = a.category_id
        where a.is_published = 1 and t.tag_name = ?
        order by a.is_top desc, a.gmt_create desc
        limit ? offset ?
        """,
        (name, page_size, offset),
    )
    return ok(data=page_result(count_row["total"], page_size, [article_summary(row) for row in rows]))


@public_bp.get("/archives")
def archives():
    rows = fetch_all(
        """
        select id, title, password, gmt_create
        from article
        where is_published = 1
        order by gmt_create desc
        """
    )
    grouped = defaultdict(list)
    for row in rows:
        created = row["gmt_create"] or ""
        month = created[:7]
        grouped[month].append(
            {
                "id": row["id"],
                "title": row["title"],
                "day": created[8:10],
                "privacy": bool(row["password"]),
            }
        )
    return ok(data={"count": len(rows), "articleMap": dict(grouped)})


@public_bp.get("/comments")
def comments():
    return ok(data={"comments": {"totalPage": 0, "pages": 0, "list": []}, "commentEnabled": False})


@public_bp.post("/comment")
def submit_comment():
    return error("评论功能已关闭", 403)
