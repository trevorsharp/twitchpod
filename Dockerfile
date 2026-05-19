FROM oven/bun:1-alpine AS base
WORKDIR /app

FROM base AS build

COPY ui/package.json ui/bun.lock ./ui
RUN cd ui && bun install --frozen-lockfile
COPY ./ui ./ui
COPY ./package.json ./package.json
COPY ./tsconfig.json ./tsconfig.json
ENV SKIP_ENV_VALIDATION=true
RUN bun run build

FROM base AS release

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production
COPY --from=build /static ./static
COPY ./src ./src
COPY ./tsconfig.json ./tsconfig.json

EXPOSE 3000/tcp
CMD bun run start
