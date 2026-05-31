FROM node:20-alpine AS build

WORKDIR /app

ARG REACT_APP_API_BASE_URL=http://localhost:8090/admin/
ARG REACT_APP_SITE_URL=http://localhost:8080

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ENV REACT_APP_API_BASE_URL=${REACT_APP_API_BASE_URL}
ENV REACT_APP_SITE_URL=${REACT_APP_SITE_URL}

RUN npm run build

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
