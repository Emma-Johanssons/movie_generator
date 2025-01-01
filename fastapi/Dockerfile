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

# Steg 3: Kopiera requirements.txt från den aktuella mappen och installera beroenden
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r /app/requirements.txt



# Kopiera .env-filen till containern om den finns (kan vara valfritt beroende på om du använder Railway's miljövariabler)
COPY .env /app/

# Kopiera hela backend-applikationen (nu från den aktuella mappen)
COPY . /app/

# Steg 4: Exponera porten som FastAPI kommer att lyssna på
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
