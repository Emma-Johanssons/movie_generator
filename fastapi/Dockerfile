# Steg 1: Använd en officiell Python-bild
FROM python:3.9-slim

# Steg 2: Sätt arbetskatalogen i containern till /app
WORKDIR /app

# Steg 3: Installera systemberoenden och pip om det inte är installerat
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    python3-dev \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Steg 4: Kontrollera pip-versionen för att säkerställa att pip är installerat korrekt
RUN pip --version

# Steg 5: Kopiera requirements.txt till containern och installera beroenden
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Steg 6: Kopiera applikationen
COPY . /app/

# Steg 7: Exponera porten 8000
EXPOSE 8000

# Steg 8: Starta Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
