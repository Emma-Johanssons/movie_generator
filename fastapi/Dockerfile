# Steg 1: Använd en officiell Python-bild
FROM python:3.9-slim

# Steg 2: Ställ in arbetskatalogen
WORKDIR /app

# Steg 3: Uppdatera systemet och installera Python-paket (om pip inte finns)
RUN apt-get update && apt-get install -y \
    python3-pip \
    build-essential \
    libpq-dev \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Steg 4: Kopiera requirements.txt och installera beroenden
COPY requirements.txt /app/

# Installera pip och uppgradera pip om det behövs
RUN python3 -m ensurepip --upgrade && \
    python3 -m pip install --no-cache-dir --upgrade pip

# Installera beroenden från requirements.txt
RUN pip install -r /app/requirements.txt

# Steg 5: Installera Uvicorn (och andra beroenden om de inte finns i requirements.txt)
RUN pip install uvicorn[standard]

# Steg 6: Kopiera hela koden från din lokala app
COPY . /app/

# Steg 7: Exponera porten
EXPOSE 8000

# Steg 8: Kör FastAPI med Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
