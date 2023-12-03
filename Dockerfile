FROM --platform=$BUILDPLATFORM node:latest as builder

WORKDIR /app

COPY . .

RUN npm install -g @angular/cli

RUN npm install

RUN npm run build

FROM --platform=$TARGETPLATFORM httpd:2.4

COPY --from=builder /app/dist/new-stock-levels /usr/local/apache2/htdocs
