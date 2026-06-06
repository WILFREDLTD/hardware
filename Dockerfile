FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}
ENV PORT=3000

RUN chmod +x /app/scripts/docker-entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["sh", "/app/scripts/docker-entrypoint.sh"]
CMD ["npm", "start"]
