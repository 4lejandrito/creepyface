FROM node:16-alpine AS compile

WORKDIR /usr/src/app

RUN apk add sudo build-base libpng libpng-dev jpeg-dev pango-dev cairo-dev giflib-dev
COPY package.json ./
COPY prisma/ ./prisma
RUN yarn
COPY . .
RUN yarn build
RUN yarn install --production --ignore-scripts --prefer-offline

FROM node:16-alpine AS runtime

RUN apk add libpng jpeg pango cairo giflib imagemagick

WORKDIR /usr/src/app

COPY --from=compile /usr/src/app/next.config.js ./
COPY --from=compile /usr/src/app/public ./public
COPY --from=compile /usr/src/app/prisma ./prisma
COPY --from=compile /usr/src/app/.next ./.next
COPY --from=compile /usr/src/app/node_modules ./node_modules
COPY --from=compile /usr/src/app/package.json ./package.json
COPY --from=compile /usr/src/app/CHECKS ./CHECKS

LABEL org.opencontainers.image.source https://github.com/4lejandrito/creepyface

ENTRYPOINT yarn start --port 5000