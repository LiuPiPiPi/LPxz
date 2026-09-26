#!/bin/sh
set -e

cd /app

# 初始化/迁移 SQLite（幂等：仅在 user 表不存在时建表）
python -m flask --app lpxz_api init-db

exec "$@"
