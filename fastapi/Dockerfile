# Steg 1: Använd Python-bild som bas
FROM python:3.9-slim

# Steg 2: Sätt arbetskatalogen i containern till /app
WORKDIR /app

# Steg 3: Kopiera requirements.txt till containern och installera beroenden
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Steg 4: Kopiera hela applikationen till containern
COPY . /app/

# Steg 5: Exponera port 8000 för FastAPI
EXPOSE 8000

# Steg 6: Kör FastAPI med Gunicorn och Uvicorn
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "main:app"]
