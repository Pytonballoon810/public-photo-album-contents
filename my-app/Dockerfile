# Use the official Node.js runtime as the base image
FROM node:22-alpine AS base

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Development image with hot reloading
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=development
# Keep telemetry disabled
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all source files (needed for dev mode)
COPY --chown=nextjs:nodejs . .

# Create .next directory for build artifacts
RUN mkdir -p /app/.next
# Create videos and qr_codes directories for mount points
RUN mkdir -p /app/public/videos
RUN mkdir -p /app/public/qr_codes
RUN chown -R nextjs:nodejs /app/public
RUN chown -R nextjs:nodejs /app/.next

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Run in development mode with turbopack for faster recompilation
CMD ["npm", "run", "dev"]
