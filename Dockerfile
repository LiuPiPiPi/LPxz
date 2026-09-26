# syntax=docker/dockerfile:1

# ========== Stage 1: build Vue 前台 ==========
FROM node:20-alpine AS view-build

WORKDIR /app

ENV HTTP_PROXY="" \
    HTTPS_PROXY="" \
    ALL_PROXY="" \
    http_proxy="" \
    https_proxy="" \
    all_proxy=""

COPY lpxz_view/package.json lpxz_view/package-lock.json ./
RUN unset HTTP_PROXY HTTPS_PROXY ALL_PROXY http_proxy https_proxy all_proxy && npm ci

COPY lpxz_view/ ./

# 单容器内同源访问，公开 API 挂在 /api/ 下
ARG VUE_APP_API_BASE_URL=/api/
ARG VUE_APP_NAME=prod
ARG VUE_APP_DEFAULT_LOGIN_USERNAME=
ENV VUE_APP_API_BASE_URL=${VUE_APP_API_BASE_URL} \
    VUE_APP_URL=${VUE_APP_API_BASE_URL} \
    VUE_APP_NAME=${VUE_APP_NAME} \
    VUE_APP_DEFAULT_LOGIN_USERNAME=${VUE_APP_DEFAULT_LOGIN_USERNAME}

RUN npm run build

# ========== Stage 2: build React 管理面板 ==========
FROM node:20-alpine AS cms-build

WORKDIR /app

ENV HTTP_PROXY="" \
    HTTPS_PROXY="" \
    ALL_PROXY="" \
    http_proxy="" \
    https_proxy="" \
    all_proxy=""

COPY lpxz_cms/package.json lpxz_cms/package-lock.json ./
RUN unset HTTP_PROXY HTTPS_PROXY ALL_PROXY http_proxy https_proxy all_proxy && npm ci

COPY lpxz_cms/ ./

# 管理面板静态资源挂在 /cms/ 下，管理 API 挂在 /admin/ 下，站点跳转指向前台首页
ARG REACT_APP_API_BASE_URL=/admin/
ARG REACT_APP_SITE_URL=/
ENV REACT_APP_API_BASE_URL=${REACT_APP_API_BASE_URL} \
    REACT_APP_SITE_URL=${REACT_APP_SITE_URL}

RUN npm run build

# ========== Stage 3: 运行时（nginx + flask，由 supervisor 托管） ==========
FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    FLASK_RUN_HOST=127.0.0.1 \
    FLASK_RUN_PORT=8090 \
    HTTP_PROXY="" \
    HTTPS_PROXY="" \
    ALL_PROXY="" \
    http_proxy="" \
    https_proxy="" \
    all_proxy=""

RUN unset HTTP_PROXY HTTPS_PROXY ALL_PROXY http_proxy https_proxy all_proxy \
    && apt-get update \
    && apt-get install -y --no-install-recommends nginx supervisor \
    && rm -rf /var/lib/apt/lists/*

COPY lpxz_api/requirements.txt /app/requirements.txt
RUN unset HTTP_PROXY HTTPS_PROXY ALL_PROXY http_proxy https_proxy all_proxy \
    && python -m pip install --upgrade pip setuptools wheel \
    && python -m pip install --no-cache-dir -r /app/requirements.txt

COPY lpxz_api/ /app/lpxz_api/

COPY --from=view-build /app/dist /usr/share/nginx/html
COPY --from=cms-build /app/build /usr/share/nginx/html/cms

COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -f /etc/nginx/sites-enabled/default

COPY supervisord.conf /etc/supervisor/supervisord.conf
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

RUN mkdir -p /app/instance /app/backups

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
CMD ["supervisord", "-n", "-c", "/etc/supervisor/supervisord.conf"]
