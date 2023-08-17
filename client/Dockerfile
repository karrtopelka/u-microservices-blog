FROM node:lts-alpine

ENV CI=true
ENV WDS_SOCKET_PORT=0

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

CMD ["yarn", "start"]
