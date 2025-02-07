FROM node:23.7.0-slim AS builder

# Install build dependencies
RUN apt-get update && \
    apt-get install -y python3 make g++ libudev-dev libusb-1.0-0-dev git libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev && \
    npm install -g pnpm@10.20.0 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN ln -s /usr/bin/python3 /usr/bin/python
WORKDIR /app
COPY package.json pnpm-lock.yaml tsconfig.json ./
COPY src/ ./src/

RUN pnpm install
RUN pnpm build

RUN mkdir -p /app/dist && \
    chown -R node:node /app && \
    chmod -R 755 /app

USER node

FROM node:23.7.0-slim

# Install runtime dependencies
RUN apt-get update && \
    apt-get install -y libudev1 libusb-1.0-0 libcairo2 libpango-1.0-0 libpangocairo-1.0-0 libgif7 librsvg2-2 && \
    npm install -g pnpm@10.20.0 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=builder /app/package.json /app/
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/src /app/src
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/tsconfig.json /app/
COPY --from=builder /app/pnpm-lock.yaml /app/

EXPOSE 3000
CMD ["pnpm", "start", "--non-interactive"]
