FROM node:18.17.1-alpine3.16@sha256:7a723a532e5342b845d273f482838d7b9d8946a500e0f7431d2f0b9cc0a1e2c1
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4000
CMD ["npm", "start"]