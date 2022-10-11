FROM node:16.16.0-alpine

ENV CONTAINER_PORT=${CONTAINER_PORT} \
  MYSQL_DATABASE=${MYSQL_DATABASE} \
  MYSQL_USER=${MYSQL_USER} \
  MYSQL_PASSWORD=${MYSQL_PASSWORD} \
  MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD} \
  MAILGRID_API_KEY=${MAILGRID_API_KEY}

RUN mkdir -p /auth-nest
WORKDIR /auth-nest

COPY package.json yarn.lock ./
RUN yarn global add @nestjs/cli
RUN yarn install

COPY . ./
