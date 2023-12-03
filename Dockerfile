FROM --platform=$BUILDPLATFORM node:latest as builder

WORKDIR /app

COPY . .

RUN npm install -g @angular/cli

RUN npm install

RUN npm run build

FROM httpd:2.4

COPY --platform=$TARGETPLATFORM --from=builder /app/dist/new-stock-levels /usr/local/apache2/htdocs
