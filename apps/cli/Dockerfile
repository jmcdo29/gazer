FROM node:24.14-alpine3.23 AS gazer-node

RUN npm i -g pnpm@10.32.0 && \
  apk add --no-cache \
  dumb-init=1.2.5-r3

FROM gazer-node AS gazer-common

WORKDIR /src
RUN apk add --no-cache \
  python3 \
  make \
  gcc \
  g++
COPY package.json \
  tsconfig* \
  nx.json \
  pnpm-lock.yaml \
  pnpm-workspace.yaml \
  ./
ENV CYPRESS_INSTALL_BINARY=0
RUN pnpm i

FROM gazer-common AS cli-build
COPY apps/cli ./apps/cli
COPY libs/server ./libs/server
COPY libs/db ./libs/db
COPY libs/shared ./libs/shared/
RUN pnpm nx run cli:build:production

FROM gazer-node AS cli-prod
LABEL description="The image that runs migrations for the ClippyClips Database. This should be ran as one-off commands on demand"
USER node
WORKDIR /src
COPY --from=cli-build --chown=node:node /src/dist ./dist
COPY --from=cli-build --chown=node:node /src/pnpm-workspace.yaml ./
RUN cp ./dist/apps/cli/package.json ./package.json
ENV NODE_ENV=production
RUN pnpm i
CMD ["dumb-init", "node", "dist/apps/cli/main", "migrate"]
