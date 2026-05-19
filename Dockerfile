FROM oven/bun:1-alpine AS base
WORKDIR /app

FROM base AS build

COPY . .
RUN cd ui && bun install --frozen-lockfile
RUN bun run build

FROM base AS release

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production
COPY --from=build /app/static ./static
COPY ./src ./src
COPY ./tsconfig.json ./tsconfig.json

EXPOSE 3000/tcp
CMD ["bun", "run", "start"]
