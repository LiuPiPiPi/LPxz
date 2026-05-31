FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN mkdir -p /app/instance

EXPOSE 8090

CMD ["sh", "-c", "flask --app lpxz_api init-db && flask --app lpxz_api run --host ${FLASK_RUN_HOST:-0.0.0.0} --port ${FLASK_RUN_PORT:-8090}"]
