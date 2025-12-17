# Multi-stage build for Next.js with Python support
FROM ghcr.io/railwayapp/nixpacks:ubuntu-1745885067 AS base

# Install Python and pip (ensure they're available at runtime)
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    && rm -rf /var/lib/apt/lists/* \
    && ln -sf /usr/bin/python3 /usr/bin/python || true

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./
COPY prisma ./prisma/

# Install Node.js dependencies
RUN npm install -g corepack@0.24.1 && corepack enable
RUN bun install --no-save

# Install Python dependencies
COPY caption-extractor-2/requirements.txt ./caption-extractor-2/
RUN pip3 install --no-cache-dir -r caption-extractor-2/requirements.txt

# Copy application code
COPY . .

# Generate Prisma client
RUN bunx --bun prisma generate

# Build Next.js application
RUN bun run build

# Production stage
FROM base AS production

ENV NODE_ENV=production

EXPOSE 3000

CMD ["bun", "run", "start"]
