
FROM node:22-alpine AS build


WORKDIR /app

COPY package*.json ./
# RUN npm install

RUN npm ci


COPY . .

# RUN npm install for development. 
RUN npm run build

# server with nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]