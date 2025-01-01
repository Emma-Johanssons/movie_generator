# Steg 1: Använd en officiell Python-bild
FROM python:3.9-slim

# Steg 2: Sätt arbetskatalogen i containern till /app
WORKDIR /app

# Installera nödvändiga systemberoenden för psycopg2 och andra bibliotek
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Steg 3: Kopiera requirements.txt och installera beroenden
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Kopiera hela backend-applikationen från fastapi/ till containern
COPY ./fastapi /app/

# Steg 4: Exponera porten som FastAPI kommer att lyssna på
EXPOSE 8000

# Steg 5: Kör FastAPI med Uvicorn (ersätt Gunicorn med Uvicorn)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
