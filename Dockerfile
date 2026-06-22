FROM php:8.2-cli-alpine AS build

RUN apk add --no-cache nodejs npm sqlite curl unzip libzip-dev oniguruma-dev
RUN docker-php-ext-install pdo_mysql mbstring zip bcmath

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction

COPY . .
RUN npm ci && npm run build

RUN cp .env.example .env && php artisan key:generate && php artisan storage:link || true

FROM php:8.2-cli-alpine

RUN apk add --no-cache sqlite curl
RUN docker-php-ext-install pdo_mysql mbstring zip bcmath

COPY --from=build /app /app
COPY --from=build /usr/bin/composer /usr/bin/composer

RUN php /app/artisan optimize

EXPOSE 8080

CMD php /app/artisan migrate --force && \
    php /app/artisan db:seed --class=DatabaseSeeder --force && \
    php /app/artisan serve --host=0.0.0.0 --port=8080
