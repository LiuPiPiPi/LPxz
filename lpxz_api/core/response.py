from flask import jsonify


def ok(message="请求成功", data=None):
    payload = {"code": 200, "msg": message, "message": message}
    if data is not None:
        payload["data"] = data
    return jsonify(payload)


def error(message="请求失败", code=400):
    return jsonify({"code": code, "msg": message, "message": message}), code
