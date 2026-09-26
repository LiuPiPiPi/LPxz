from .core.db import fetch_all
from .core.utils import rows_to_list


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


def page_result(total, page_size, items):
    total_page = (total + page_size - 1) // page_size
    return {"totalPage": total_page, "pages": total_page, "list": items}


def empty_page(page_num, page_size):
    return page_payload(0, page_num, page_size, [])
