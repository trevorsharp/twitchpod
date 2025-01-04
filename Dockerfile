FROM node:lts AS base
WORKDIR /app

# Install production dependencies
FROM base AS install

COPY ./package.json ./package.json

RUN npm install --omit=dev

# Build project
FROM install AS build

ENV SKIP_ENV_VALIDATION=true

RUN npm install

COPY . .
RUN npm run build

# Compose release container
FROM install AS release

COPY --from=build /app/.next ./.next

EXPOSE 3000
CMD ["npm", "run", "start"]