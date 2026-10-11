# 部署说明:cron 轮询自动更新(替代 CI SSH 触发)

CI 只负责构建并推送镜像到 GHCR;服务器上由 cron 周期运行
[`poll-update.sh`](./poll-update.sh) 拉取新镜像并重启容器。
CI 的境外 IP 不再 SSH 登录云服务器,云安全告警随之消失。

## 部署架构

```
GitHub Actions (build+push)  →  ghcr.io/liupipipi/lpxz
                                           ↑ 服务器主动出站 (cron 每 5 分钟)
服务器: poll-update.sh → docker pull → ID 变化? → compose up -d
```

## 一次性安装(只在服务器上执行一次)

```bash
# 1. 拷贝脚本(compose 文件旧 CI 已同步过,如首次部署则一并拷贝)
scp deploy/poll-update.sh root@<SERVER>:/root/lpxz-prod/
scp docker-compose.prod.yml root@<SERVER>:/root/lpxz-prod/   # 如缺失
chmod +x /root/lpxz-prod/poll-update.sh

# 2. 服务器上添加 cron(先确认有 flock,util-linux 自带)
crontab -e
# 添加一行:
*/5 * * * * /root/lpxz-prod/poll-update.sh >> /var/log/lpxz-poll.log 2>&1
```

首次可以手动跑一次 `sh -x /root/lpxz-prod/poll-update.sh` 验证。

## 行为说明

- 每轮 `docker pull`,层无变化时几乎零开销;仅当镜像 ID 变化才 `compose up -d`,
  自动重建容器(秒级重启),随后清理悬空镜像。
- 拉取失败(网络抖动等)时脚本静默退出,cron 下一轮自动重试,天然自愈。
- 脚本有单实例锁,上一轮未完成时本轮跳过。

## 手动回滚

轮询会自动拉回最新镜像,所以回滚前先暂时停掉 cron:

```bash
crontab -e   # 注释掉 poll-update.sh 那一行
docker pull ghcr.io/liupipipi/lpxz:sha-<旧提交hash>
docker tag ghcr.io/liupipipi/lpxz:sha-<旧提交hash> ghcr.io/liupipipi/lpxz:latest
docker compose -f /root/lpxz-prod/docker-compose.prod.yml up -d
```

确认稳定后再把 cron 行加回去(下一次推送会恢复自动更新)。

## 其他

- `docker-compose.prod.yml` 改动频率极低;日后修改它时手动 scp 一次即可。
- 仓库 secrets `SERVER_HOST/SERVER_USER/SERVER_SSH_KEY/SERVER_PORT` 与变量
  `DEPLOY_ENABLED` 已不再被 workflow 使用,可在 GitHub 上删除。