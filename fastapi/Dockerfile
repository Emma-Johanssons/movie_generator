# Steg 1: Använd en officiell Python-bild
FROM python:3.9-slim

# Steg 2: Sätt arbetskatalogen i containern till /app/fastapi
WORKDIR /app/fastapi

# Installera nödvändiga systemberoenden för psycopg2 och andra bibliotek
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Steg 3: Kopiera requirements.txt från fastapi-mappen och installera beroenden
COPY ./fastapi/requirements.txt /app/fastapi/
RUN pip install --no-cache-dir -r /app/fastapi/requirements.txt

# Se till att gunicorn installeras om det inte redan är i requirements.txt
RUN pip install gunicorn

# Kopiera .env-filen till containern om den finns (kan vara valfritt beroende på om du använder Railway's miljövariabler)
COPY .env /app/fastapi/

# Kopiera hela backend-applikationen från fastapi/ till containern
COPY ./fastapi /app/fastapi

# Steg 4: Exponera porten som FastAPI kommer att lyssna på
EXPOSE 8000

# Steg 5: Kör FastAPI med Gunicorn
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8000", "main:app"]
