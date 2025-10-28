# Stage 1 - build
FROM node:18-alpine AS builder
WORKDIR /app

# copy package files and install deps first for better cache
COPY package.json package-lock.json* yarn.lock* ./
RUN npm ci --prefer-offline --ignore-scripts --no-audit --progress=false

# copy source
COPY . .

# build Next.js
RUN npm run build

# Stage 2 - production image
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# copy only needed files from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

# Start the Next.js app
CMD ["npm", "run", "start"]