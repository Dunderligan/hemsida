FROM node:24-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS prod

WORKDIR /app
COPY pnpm-lock.yaml ./
RUN pnpm fetch --prod

COPY . .
RUN pnpm run build

FROM base AS run
WORKDIR /app
COPY --from=prod /app/node_modules ./node_modules
COPY --from=prod /app/build ./build
EXPOSE 3000
CMD [ "pnpm", "start" ]
