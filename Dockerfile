FROM php:8.2-fpm-alpine AS build

RUN apk add --no-cache \
    nodejs npm \
    nginx \
    sqlite \
    curl \
    unzip \
    libzip-dev \
    oniguruma-dev

RUN docker-php-ext-install pdo_mysql mbstring zip bcmath

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction

COPY package.json package-lock.json ./
RUN npm ci && npm run build

COPY . .

RUN cp .env.example .env && php artisan key:generate

RUN php artisan storage:link || true

FROM php:8.2-fpm-alpine

RUN apk add --no-cache nginx sqlite curl

RUN docker-php-ext-install pdo_mysql mbstring zip bcmath

COPY --from=build /app /app
COPY --from=build /usr/bin/composer /usr/bin/composer

RUN php /app/artisan optimize

COPY nginx.conf /etc/nginx/http.d/default.conf

EXPOSE 8080

CMD ["sh", "-c", "php /app/artisan migrate --force && php /app/artisan db:seed --class=DatabaseSeeder --force && nginx && php-fpm"]
