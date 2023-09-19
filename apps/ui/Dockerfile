FROM node:20.2-alpine3.18 as gazer-node


RUN npm i -g pnpm@8.6.10 && \
  apk add --no-cache \
  dumb-init=1.2.5-r2

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
  ./
ENV CYPRESS_INSTALL_BINARY=0
RUN pnpm i

FROM gazer-common AS ui-build
WORKDIR /src
COPY apps/ui ./apps/ui
COPY libs/ui ./libs/ui
COPY libs/shared ./libs/shared/
RUN VITE_SERVER_URL="https://api.clippyclips.net" pnpm nx run ui:build:production

FROM caddy:2.6.4-alpine as ui-prod
LABEL description="The ClippyClips webui image, ran via a Caddy reverse proxy"
WORKDIR /src
COPY apps/ui/robots.txt ./dist/apps/ui/robots.txt
COPY --from=ui-build /src/dist/apps/ui/ ./dist/apps/ui
COPY Caddyfile ./Caddyfile
CMD ["caddy", "run", "--config", "Caddyfile"]
