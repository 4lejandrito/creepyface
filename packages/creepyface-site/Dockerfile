FROM node:latest

WORKDIR /usr/src/app

RUN apt-get update
RUN apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
COPY package.json yarn.lock ./
COPY prisma/ ./prisma
RUN yarn install
COPY . .

ENTRYPOINT yarn start --port 5000
