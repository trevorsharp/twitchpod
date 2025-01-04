FROM node:lts AS base
WORKDIR /app

COPY ./package.json ./package.json
RUN npm install

COPY . .
RUN npm run build

FROM node:lts AS release
WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/.next ./.next

EXPOSE 3000
CMD ["npm", "run", "start"]