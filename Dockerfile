#FROM node:20-alpine as builder
# Pinned due to https://github.com/nodejs/docker-node/issues/2009
FROM node:20-alpine3.18

ARG BUILD_TIMESTAMP
ENV BUILD_TIMESTAMP=$BUILD_TIMESTAMP
ARG GIT_COMMIT
ENV GIT_COMMIT=$GIT_COMMIT

RUN apk add bash curl
RUN npm install -g pnpm
WORKDIR /app

# pnpm fetch does require only lockfile
COPY pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/root/.pnpm-store/v3 pnpm fetch -r

ADD . ./
RUN --mount=type=cache,id=pnpm,target=/root/.pnpm-store/v3 pnpm install -r

# Do not perform environment variable validation during build time
RUN SKIP_ENV_VALIDATION=true npm run build

RUN chown node:node . -R

ADD docker-entrypoint.sh /
USER node

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["--help"]
