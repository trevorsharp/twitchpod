FROM node:lts-alpine AS base
WORKDIR /app

COPY ./package.json ./package.json

# Install production dependencies
FROM base AS install

RUN npm install --omit=dev

# Build project
FROM install AS build

ENV SKIP_ENV_VALIDATION=true

RUN npm install

COPY . .
RUN npm run build

# Compose release container
FROM base AS release

COPY --from=install /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next

EXPOSE 3000
CMD ["npm", "run", "start"]