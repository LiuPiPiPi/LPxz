from ..core.db import fetch_all, fetch_one
from .tables import ensure_log_tables


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
