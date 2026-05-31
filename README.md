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
- `flask_api`：后端接口服务，基于 Flask 与 SQLite。

此外还包含：

- `logo`：站点 logo 与 favicon 资源。
- `docs`：项目补充文档与图示资源。

## 目录结构

```text
LPxz/
├── docs/         # 文档与图示
├── flask_api/    # Flask 后端 API
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

```bash
cd flask_api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
flask --app lpxz_api init-db
flask --app lpxz_api run --port 8090
```

默认开发端口：`8090`
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

项目已经将运行配置统一收敛到根目录 `.env`：

- [/.env.example](/Users/lpxz/Documents/Repos/LPxz/.env.example)：示例模板
- `/.env`：实际本地配置，供 Docker Compose、Flask 后端和前端 Docker 构建共同使用

根 `.env` 目前涵盖：

- 容器端口映射
- Flask 密钥、SQLite 路径、CORS、调度开关
- SQLite 备份目录
- Vue 前台公开构建参数
- React 后台公开构建参数

注意：

- 前端构建参数虽然现在统一从根 `.env` 注入，但它们仍属于公开配置，构建后会进入静态资源，不要放真正的密钥或管理员密码。
- 后端密钥、数据库密码等敏感信息应只保留在根 `.env` 或部署平台的环境变量中。

## Docker

仓库已经补齐 Docker 构建文件：

- [docker-compose.yml](/Users/lpxz/Documents/Repos/LPxz/docker-compose.yml)
- [flask_api/Dockerfile](/Users/lpxz/Documents/Repos/LPxz/flask_api/Dockerfile)
- [lpxz_view/Dockerfile](/Users/lpxz/Documents/Repos/LPxz/lpxz_view/Dockerfile)
- [lpxz_cms/Dockerfile](/Users/lpxz/Documents/Repos/LPxz/lpxz_cms/Dockerfile)

直接在根目录执行：

```bash
docker compose up --build
```

默认端口：

- 前台：`http://localhost:8080`
- 后台：`http://localhost:3000`
- API：`http://localhost:8090`

说明：

- 前后台容器使用 Nginx 提供静态资源，并已配置 SPA 路由回退。
- 后端容器启动时会自动执行一次 `init-db`，随后监听 `8090` 端口。
- SQLite 数据目录通过 `docker-compose.yml` 挂载到 `flask_api/instance`，便于持久化。
- SQLite 备份目录通过 `docker-compose.yml` 挂载到 `flask_api/backups`，每周一 08:00 会自动生成一份带时间戳的备份文件。

## 开发说明

- 根目录已经初始化为 git 仓库。
- 当前由根仓库统一管理全部子项目代码。
- 前端构建已验证可以成功执行，但存在少量 lint、sourcemap 和体积警告，不影响产物生成。

## License

如无额外说明，本仓库代码与资源默认仅供学习、开发与个人项目维护使用。
