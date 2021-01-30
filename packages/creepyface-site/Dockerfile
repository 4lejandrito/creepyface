FROM node:latest

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
COPY prisma/ ./prisma
RUN yarn install
COPY . .

ENTRYPOINT yarn start --port 5000
