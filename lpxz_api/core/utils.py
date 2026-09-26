from datetime import datetime

import markdown
from flask import request


def now_text():
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def row_to_dict(row):
    return dict(row) if row is not None else None


def rows_to_list(rows):
    return [dict(row) for row in rows]


def bool_int(value, default=False):
    if value is None:
        return 1 if default else 0
    return 1 if bool(value) else 0


def parse_bool(value):
    if isinstance(value, bool):
        return value
    if isinstance(value, int):
        return value != 0
    return str(value).lower() in ("1", "true", "yes", "on")


def render_markdown(text):
    return markdown.markdown(
        text or "",
        extensions=["extra", "toc", "sane_lists"],
        output_format="html5",
    )


def paginate(page_num, page_size):
    page_num = max(int(page_num or 1), 1)
    page_size = min(max(int(page_size or 10), 1), 100)
    return page_num, page_size, (page_num - 1) * page_size


def get_json():
    return request.get_json(silent=True) or {}
