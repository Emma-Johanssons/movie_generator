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

# Steg 3: Kopiera requirements.txt från backend-mappen och installera beroenden
COPY ./requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Se till att uvicorn installeras om det inte redan är i requirements.txt
RUN pip install uvicorn

# Kopiera .env-filen till containern
COPY .env /app/

# Kopiera hela backend-applikationen (från nuvarande mapp till containern)
COPY . /app/

# Steg 5: Exponera porten som FastAPI kommer att lyssna på
EXPOSE 8000

# Steg 6: Kör FastAPI med uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
