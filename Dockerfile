FROM node:16-alpine

RUN apk add --no-cache yarn python3 py3-pip
RUN pip install twitch-dl

WORKDIR /app

COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock
RUN yarn

COPY . .
RUN yarn build

CMD ["yarn", "start"]
