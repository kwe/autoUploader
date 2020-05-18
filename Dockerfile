FROM node:14-alpine AS build

RUN apk add --update --no-cache \
  python \
  make \
  g++

COPY . /src
WORKDIR /src

RUN npm ci

RUN npm prune --production

FROM node:14-alpine

EXPOSE 3000
WORKDIR /usr/src/service

COPY --from=build /src/node_modules node_modules
COPY --from=build /src/app.js  .

USER node
EXPOSE 3000
CMD ["node", "/usr/src/service/app.js"]