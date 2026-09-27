# LPxz

<p align="center">
  <img src="./logo/favicon-300x300.png" alt="LPxz Logo" width="180" />
</p>

<p align="center">
  一个包含博客前台、管理后台与 Flask API 的完整个人内容平台项目。
</p>

## 项目简介

本仓库聚合了 LPxz 的前后端代码与相关资源，适合本地开发、联调、构建与部署。当前目录下主要包含三个核心子项目：

- `lpxz_view`：博客前台，基于 Vue 3 与 Vue CLI。
- `lpxz_cms`：内容管理后台，基于 React 18、Ant Design 与 Create React App。
- `lpxz_api`：后端接口服务，基于 Flask 与 SQLite。

此外还包含：

- `logo`：站点 logo 与 favicon 资源。
- `docs`：项目补充文档与图示资源。

## 目录结构

```text
LPxz/
├── docs/         # 文档与图示
├── lpxz_api/     # Flask 后端 API
├── logo/         # Logo / favicon 资源
├── lpxz_cms/     # React 管理后台
└── lpxz_view/    # Vue 博客前台
```

## 技术栈

- 前台：Vue 3、Vue Router、Vuex、Element Plus
- 后台：React 18、React Router、Ant Design、Ant Design Charts
- 后端：Flask、SQLite

## 快速开始

### 1. 启动后端

> 包名 `lpxz_api` 需从仓库根目录解析，以下命令均在仓库根目录执行（不要 `cd lpxz_api`）。

```bash
python -m venv lpxz_api/.venv
source lpxz_api/.venv/bin/activate
pip install -r lpxz_api/requirements.txt
flask --app lpxz_api init-db
flask --app lpxz_api run --port 8090
```

默认开发端口：`8090`
SQLite 与备份目录默认落在 `lpxz_api/instance`、`lpxz_api/backups`（相对 `lpxz_api/` 解析）。
使用前请先在根目录准备好 `/.env`。

### 2. 启动博客前台

```bash
cd lpxz_view
npm install
npm run serve
```

默认开发端口通常为：`8080`

### 3. 启动管理后台

```bash
cd lpxz_cms
npm install
npm start
```

默认开发端口通常为：`3000`

## 构建命令

两个前端项目都支持生产构建：

```bash
cd lpxz_view
npm run build
```

```bash
cd lpxz_cms
npm run build
```

构建产物目录：

- `lpxz_view/dist`
- `lpxz_cms/build`

## 环境变量

全仓库只有一个 `.env`，位于根目录，是所有运行配置的唯一来源：

- [/.env.example](/Users/lpxz/Documents/Repos/LPxz/.env.example)：示例模板（复制为 `.env` 后按需修改）
- `/.env`：实际本地配置，供 Docker Compose 与 Flask 后端使用

根 `.env` 涵盖：

- 容器端口映射（`WEB_PORT`）、数据目录（`LPXZ_DATA_DIR`）
- Flask 密钥、SQLite 路径、CORS、调度开关、管理员账号
- 前端构建参考参数（`VUE_APP_*` / `REACT_APP_*`）

注意：

- 单容器 Docker 构建时，前端 API 地址使用 Dockerfile 内的 ARG 默认值（`/api/`、`/admin/`，同源由 nginx 反代），**不**从 `.env` 读取；分域名部署时再改 Dockerfile ARG 或构建参数。
- 前端构建参数属于公开配置，会进入静态资源，不要放真正的密钥或管理员密码。
- 后端密钥、数据库密码等敏感信息应只保留在根 `.env` 或部署平台的环境变量中。
- 本地前端开发（`npm run serve` / `npm start`）如需指向本地后端，在前端目录下新建 `.env.local`（已被 git 忽略）写入本地地址即可。

## Docker

仓库已经补齐 Docker 构建文件：

- [docker-compose.yml](/Users/lpxz/Documents/Repos/LPxz/docker-compose.yml)
- [Dockerfile](/Users/lpxz/Documents/Repos/LPxz/Dockerfile)

直接在根目录执行：

```bash
docker compose up --build
```

单容器对外端口（`${WEB_PORT:-8080}` → 容器 80，nginx 统一入口）：

- 前台：`http://localhost:8080/`
- 后台：`http://localhost:8080/cms/`
- 公开 API：`http://localhost:8080/api/`
- 管理 API：`http://localhost:8080/admin/`

说明：

- 单容器内由 Nginx 提供前台与管理面板静态资源，并已配置 SPA 路由回退。
- 容器启动时由 entrypoint 自动执行一次 `init-db`，随后 Flask 监听容器内 `8090`（由 Nginx 反代）。
- SQLite 数据目录通过 `docker-compose.yml` 从 `${LPXZ_DATA_DIR}/instance` 挂载；生产环境默认路径为 `/var/lib/lpxz/instance`，与源码目录隔离。
- SQLite 备份目录从 `${LPXZ_DATA_DIR}/backups` 挂载；生产环境默认路径为 `/var/lib/lpxz/backups`，每周一 08:00 会自动生成一份带时间戳的备份文件。

### 生产 API 路径

生产环境为单容器同源部署：前台、CMS 静态资源、公开 API 与管理 API 全部由 `https://lpxz.work/` 同源提供。

- 前台调用 `https://lpxz.work/api/`（公开接口，例如 `/api/site`）。
- CMS 调用 `https://lpxz.work/admin/`（管理接口，含登录）。
- 容器内 Flask 仅监听 `127.0.0.1:8090`，由容器内 Nginx 反代至 `/api/` 与 `/admin/`；宿主机 Nginx 再将 `https://lpxz.work` 反代到容器 `127.0.0.1:8080`，不应再将 8090 直接暴露公网。
- `api.lpxz.work` 与 `admin.lpxz.work` 子域名已退役，不再使用。

## 开发说明

- 根目录已经初始化为 git 仓库。
- 当前由根仓库统一管理全部子项目代码。
- 前端构建已验证可以成功执行，但存在少量 lint、sourcemap 和体积警告，不影响产物生成。

## License

如无额外说明，本仓库代码与资源默认仅供学习、开发与个人项目维护使用。
