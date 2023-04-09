FROM node:latest as builder

WORKDIR /app

COPY . .

RUN npm install -g @angular/cli

RUN npm install

RUN npm run build

FROM nginx:latest

COPY --from=builder /app/dist/new-stock-levels /usr/share/nginx/html