FROM node:16.16.0-alpine

RUN mkdir -p /auth-nest
WORKDIR /auth-nest

COPY package.json yarn.lock ./
RUN yarn install

COPY . ./
