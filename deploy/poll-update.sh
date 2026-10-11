#!/usr/bin/env bash
#
# 轮询 GHCR 镜像更新并自动部署（替代 CI SSH 触发）。
# CI 只负责构建并推送镜像，本脚本在服务器上由 cron 周期执行：
# 拉取镜像后对比本地镜像 ID，有变化才 docker compose up -d。
# 全程服务器主动出站，CI 境外 IP 不再登录服务器。
#
# 安装（一次性）：
#   scp deploy/poll-update.sh root@<SERVER>:/root/lpxz-prod/
#   crontab -e 添加（未安装 flock 时先 yum/apt install util-linux）：
#     */5 * * * * /root/lpxz-prod/poll-update.sh >> /var/log/lpxz-poll.log 2>&1
#
# 注意：
#   - docker-compose.prod.yml 需已存在于 $COMPOSE_FILE（旧 CI 每次部署都会同步它）。
#     该文件变更频率极低，日后有修改时手动同步一次：
#       scp docker-compose.prod.yml root@<SERVER>:/root/lpxz-prod/
#   - 回滚见 deploy/README.md（注意：轮询会自动拉最新，回滚前须先停掉 cron）。
set -euo pipefail

IMAGE="${IMAGE:-ghcr.io/liupipipi/lpxz}"
TAG="${TAG:-latest}"
COMPOSE_FILE="${COMPOSE_FILE:-/root/lpxz-prod/docker-compose.prod.yml}"

# 单实例锁：上一轮尚未结束（拉取/重启中）时本轮直接跳过
LOCK=/tmp/lpxz-poll-update.lock
exec 9>"$LOCK"
flock -n 9 || exit 0

if [ ! -f "$COMPOSE_FILE" ]; then
  echo "[$(date '+%F %T')] $COMPOSE_FILE 不存在，跳过（请先手动拷贝 docker-compose.prod.yml）" >&2
  exit 0
fi

# 对比拉取前后的镜像 ID：无变化时 docker pull 命中本地层，几乎零开销
BEFORE=$(docker images --no-trunc --format '{{.ID}}' "$IMAGE:$TAG" 2>/dev/null || true)
docker pull -q "$IMAGE:$TAG"
AFTER=$(docker images --no-trunc --format '{{.ID}}' "$IMAGE:$TAG")

if [ "$BEFORE" != "$AFTER" ]; then
  echo "[$(date '+%F %T')] 检测到新镜像 $IMAGE:$TAG，重启容器"
  docker compose -f "$COMPOSE_FILE" up -d
  docker image prune -f >/dev/null 2>&1 || true
fi