import bcrypt
import click
from flask import Flask, make_response, request
from werkzeug.exceptions import HTTPException

from .config import Config
from .db import close_db, execute, fetch_one, init_db
from .log_service import ensure_log_tables, mark_request_start, save_exception_log, save_operation_log, save_visit_log
from .response import error
from .routes.admin import admin_bp
from .routes.auth import auth_bp
from .routes.public import public_bp
from .scheduler import start_scheduler


def create_app(config_object=Config):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(config_object)

    app.teardown_appcontext(close_db)

    @app.before_request
    def before_request():
        mark_request_start()
        if request.method == "OPTIONS":
            return make_response("", 204)

    @app.after_request
    def add_cors_headers(response):
        save_operation_log(response)
        save_visit_log(response)
        origin = request.headers.get("Origin")
        allowed_origins = app.config.get("CORS_ALLOWED_ORIGINS", ["*"])
        allow_all_origins = "*" in allowed_origins

        if origin and (allow_all_origins or origin in allowed_origins):
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Vary"] = "Origin"
        elif allow_all_origins:
            response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = (
            request.headers.get("Access-Control-Request-Headers")
            or "Authorization, Content-Type, identification"
        )
        response.headers["Access-Control-Expose-Headers"] = "Authorization, identification"
        response.headers["Access-Control-Max-Age"] = "3600"
        return response

    @app.errorhandler(Exception)
    def handle_exception(exc):
        if isinstance(exc, HTTPException):
            return exc
        save_exception_log(exc)
        return error("异常错误", 500)

    @app.cli.command("init-db")
    def init_db_command():
        init_db()
        print("Initialized the SQLite database.")

    @app.cli.command("create-admin")
    @click.argument("username")
    @click.password_option()
    def create_admin_command(username, password):
        password_hash = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        existing = fetch_one("select id from user where username = ?", (username,))
        if existing:
            execute("update user set password = ?, role = 'ROLE_admin' where username = ?", (password_hash, username))
            print(f"Updated admin user: {username}")
        else:
            execute(
                "insert into user (username, password, role) values (?, ?, 'ROLE_admin')",
                (username, password_hash),
            )
            print(f"Created admin user: {username}")

    app.register_blueprint(public_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_bp)
    with app.app_context():
        ensure_log_tables()
    if app.config.get("ENABLE_SCHEDULER"):
        start_scheduler(app)
    return app
