FROM node:20-alpine AS build

WORKDIR /app

ARG VUE_APP_API_BASE_URL=http://localhost:8090/
ARG VUE_APP_NAME=prod
ARG VUE_APP_DEFAULT_LOGIN_USERNAME=

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ENV VUE_APP_API_BASE_URL=${VUE_APP_API_BASE_URL}
ENV VUE_APP_URL=${VUE_APP_API_BASE_URL}
ENV VUE_APP_NAME=${VUE_APP_NAME}
ENV VUE_APP_DEFAULT_LOGIN_USERNAME=${VUE_APP_DEFAULT_LOGIN_USERNAME}

RUN npm run build

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
