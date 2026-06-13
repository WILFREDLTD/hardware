# Stage 1: build the Next.js app
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies first for faster rebuilds
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

# Stage 2: production image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --production

COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma/
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client/
COPY --from=builder /app/.next ./.next/
COPY --from=builder /app/public ./public/
COPY --from=builder /app/prisma ./prisma/
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/tsconfig.prisma.json ./tsconfig.prisma.json

EXPOSE 3000
CMD ["npm", "run", "start"]
