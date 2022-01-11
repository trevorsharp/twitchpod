FROM node:16-alpine

RUN apk add --no-cache yarn python3 py3-pip
RUN pip install twitch-dl

WORKDIR /app

COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock
RUN yarn

COPY ./src ./src
COPY ./tsconfig.json ./tsconfig.json
RUN yarn build

ENV NODE_ENV=production
CMD node /app/build/index.js
