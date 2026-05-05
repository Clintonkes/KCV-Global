# --- Stage 1: Build the React Frontend ---
FROM node:18-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# --- Stage 2: Set up the Python Backend ---
FROM python:3.11-slim
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend code
COPY . .

# Copy the built frontend from stage 1
COPY --from=frontend-builder /app/dist ./dist

# Expose the port Railway uses (defaults to 8080)
EXPOSE 8080

# Command to run the application
CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8080"]
