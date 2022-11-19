FROM php:7.4-fpm

RUN cd /usr/bin && curl -s http://getcomposer.org/installer | php && ln -s /usr/bin/composer.phar /usr/bin/composer
RUN apt-get update \
&& apt-get install -y \
git \
zip \
unzip \
vim

RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -y nodejs

RUN apt-get update \
    && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo_mysql pdo_pgsql mysqli 
RUN docker-php-ext-install bcmath
RUN echo "alias ll='ls -la'" >> ~/.bashrc && . ~/.bashrc
COPY . .

WORKDIR app

RUN composer install && \ 
		php artisan cache:clear && \
		php artisan config:clear && \
		php artisan config:cache && \
		chmod -R 777 storage
