from flask import Blueprint

admin_bp = Blueprint("admin", __name__, url_prefix="/admin")
public_bp = Blueprint("public", __name__, url_prefix="/api")
auth_bp = Blueprint("auth", __name__)
