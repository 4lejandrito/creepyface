FROM node:16-alpine AS compile

WORKDIR /usr/src/app

RUN apk add sudo build-base libpng libpng-dev jpeg-dev pango-dev cairo-dev giflib-dev openssl1.1-compat
COPY package.json ./
COPY yarn.lock ./
COPY packages/creepyface-site/package.json ./packages/creepyface-site/package.json
COPY packages/creepyface-site/prisma ./packages/creepyface-site/prisma
RUN yarn --frozen-lockfile
COPY lerna.json ./
COPY packages/creepyface-site ./packages/creepyface-site
RUN yarn prisma generate
RUN yarn build
RUN yarn install --production --ignore-scripts --prefer-offline

FROM node:16-alpine AS runtime

RUN apk add libpng jpeg pango cairo giflib imagemagick openssl1.1-compat

WORKDIR /usr/src/app

ENV SQLITE_DB_URL=file:/usr/src/app/.data/sqlite.db

COPY --from=compile /usr/src/app/packages/creepyface-site/.env ./
COPY --from=compile /usr/src/app/packages/creepyface-site/.next ./.next
COPY --from=compile /usr/src/app/packages/creepyface-site/next.config.js ./
COPY --from=compile /usr/src/app/packages/creepyface-site/package.json ./
COPY --from=compile /usr/src/app/packages/creepyface-site/prisma ./prisma
COPY --from=compile /usr/src/app/packages/creepyface-site/app.json ./
COPY --from=compile /usr/src/app/packages/creepyface-site/public ./public
COPY --from=compile /usr/src/app/packages/creepyface-site/node_modules ./node_modules
COPY --from=compile /usr/src/app/node_modules ./node_modules

LABEL org.opencontainers.image.source https://github.com/4lejandrito/creepyface

ENTRYPOINT yarn start --port 5000