FROM python:3.13-slim

RUN groupadd -g 1000 appuser && useradd -u 1000 -g 1000 appuser

WORKDIR /app

COPY pyproject.toml .
COPY app ./app

RUN python -m pip install --upgrade pip
RUN python -m pip install --no-cache-dir "fastapi>=0.111.1" "uvicorn[standard]>=0.23.0"
RUN python -m pip install --no-cache-dir .

RUN chown -R appuser:appuser /app

USER appuser

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
