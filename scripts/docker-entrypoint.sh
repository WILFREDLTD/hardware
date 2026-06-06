#!/bin/sh
set -e

if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL is not set. Please provide the database connection string."
  exit 1
fi

echo "Waiting for database to become available..."
until npx prisma db pull >/dev/null 2>&1; do
  sleep 1
  echo "Waiting for database..."
done

echo "Database available. Applying migrations..."
npx prisma migrate deploy

echo "Checking if initial seed is needed..."
node /app/scripts/docker-seed-check.js

if [ "$#" -eq 0 ]; then
  set -- npm start
fi

echo "Launching container command: $@"
exec "$@"
