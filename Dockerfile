FROM node:lts-alpine

RUN npm i -g bun

WORKDIR /app

COPY ./package.json ./package.json
COPY ./bun.lockb ./bun.lockb
RUN bun install

COPY . .
RUN bun build

CMD ["bun", "start"]
