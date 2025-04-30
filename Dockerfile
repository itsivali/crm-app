# Build stage
FROM node:18.17.1-alpine3.16@sha256:7a723a532e5342b845d273f482838d7b9d8946a500e0f7431d2f0b9cc0a1e2c1 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Add CI=false to prevent treating warnings as errors
ENV CI=false
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]