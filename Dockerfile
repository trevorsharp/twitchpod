FROM oven/bun:1-alpine AS base
WORKDIR /app

FROM base AS build

COPY ui/package.json ui/bun.lock ./
RUN bun install --frozen-lockfile
COPY ./ui .
ENV SKIP_ENV_VALIDATION=true
RUN bun run build

FROM base AS release

RUN apk add --no-cache nginx

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production
COPY --from=build /static ./static
COPY ./src ./src
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 3000/tcp
CMD nginx && bun run start
