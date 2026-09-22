# ==========================================
# 🐳 Dockerfile for Vite + React Frontend
# ==========================================

# Step 1: Base Image
# node:20-alpine is an ultra-lightweight Node.js Linux image
FROM node:22-alpine

# Step 2: Working Directory inside the container
WORKDIR /app

# Step 3: Layer Caching for Node Dependencies
# Copy package files first so Docker caches the installed packages
COPY package*.json ./

# Step 4: Install Dependencies
RUN npm install

# Step 5: Copy application code into container
COPY . .

# Step 6: Expose the Vite development server port
EXPOSE 5174

# Step 7: Environment variables
ENV VITE_API_URL=http://localhost:5000


CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5174"]