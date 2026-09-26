import json
import time

from flask import request


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
