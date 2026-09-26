from flask import request

from ..core.blueprints import auth_bp
from ..core.db import fetch_one
from ..core.response import error, ok
from ..core.security import check_password, generate_token
from ..logging import save_login_log


@auth_bp.post("/admin/login")
def login():
    data = request.get_json(silent=True) or {}
    username = data.get("username", "")
    password = data.get("password", "")
    user = fetch_one("select * from user where username = ?", (username,))
    if user is None or not check_password(password, user["password"]):
        save_login_log(username, False, "用户名或密码错误")
        return error("用户名或密码错误", 401)
    token = generate_token(user)
    save_login_log(user["username"], True, "登录成功")
    return ok("登录成功", {"token": token, "user": {"username": user["username"], "role": user["role"]}})
