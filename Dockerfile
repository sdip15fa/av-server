FROM node:18-alpine AS build

WORKDIR /usr/src/app

COPY ./package.json ./yarn.lock ./tsconfig.json ./

RUN yarn install --production

COPY ./src ./src

RUN yarn build

FROM node:18-alpine

WORKDIR /usr/src/app

COPY ./package.json ./tsconfig.json ./

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

CMD yarn start
