# ==============================================================================
# 🐳 Docker Compose Configuration: Simple Users CRUD
# ==============================================================================

services:
  # Backend Service (Express.js on Port 5000)
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: docker_backend
    ports:
      - "5000:5000"
    environment:
      - PORT=5000
    volumes:
      - ./backend:/app
      - /app/node_modules
    restart: unless-stopped

  # Frontend Service (Vite + React on Port 5173)
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: docker_frontend
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://localhost:5000
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - backend
    restart: unless-stopped
