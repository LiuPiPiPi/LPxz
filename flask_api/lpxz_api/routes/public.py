import json
from collections import defaultdict

from flask import Blueprint, request

from ..db import execute, fetch_all, fetch_one
from ..response import error, ok
from ..utils import paginate, render_markdown, rows_to_list

public_bp = Blueprint("public", __name__)

PRIVATE_ARTICLE_DESCRIPTION = "此文章受密码保护。"


def parse_json_value(value):
    if not value:
        return value
    try:
        return json.loads(value)
    except (TypeError, json.JSONDecodeError):
        return value


def camelize_common_fields(item):
    for snake, camel in (
        ("gmt_create", "gmtCreate"),
        ("gmt_modified", "gmtModified"),
        ("read_time", "readTime"),
    ):
        if snake in item:
            item[camel] = item.pop(snake)
    return item


def page_result(total, page_size, items):
    total_page = (total + page_size - 1) // page_size
    return {"totalPage": total_page, "pages": total_page, "list": items}


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


@public_bp.get("/articles")
def articles():
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


@public_bp.get("/comments")
def comments():
    return ok(data={"comments": {"totalPage": 0, "pages": 0, "list": []}, "commentEnabled": False})


@public_bp.post("/comment")
def submit_comment():
    return error("评论功能已关闭", 403)


@public_bp.get("/about")
def about():
    rows = fetch_all("select name_en, name_zh, value from about")
    data = {row["name_en"]: row["value"] for row in rows}
    if "content" in data:
        data["content"] = render_markdown(data["content"])
    return ok(data=data)


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
