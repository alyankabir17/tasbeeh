# Stage 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Build the application
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Next.js standalone build requires this
ENV NEXT_PRIVATE_STANDALONE=true
RUN npm run build

# Stage 3: The actual production runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# We ONLY copy the standalone output and the static files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]