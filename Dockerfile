FROM node:12

WORKDIR /usr/src/app

COPY packages/creepyface-site/package.json yarn.lock ./
RUN NODE_ENV=production yarn --production
COPY packages/creepyface-site/.dist ./dist
COPY packages/creepyface-site/backend ./backend
COPY packages/creepyface-site/CHECKS ./

ENTRYPOINT yarn live
