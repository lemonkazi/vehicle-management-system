#!/bin/sh

# Wait for the database to be ready
echo "Waiting for database..."
while ! nc -z mysql 3306; do
  sleep 1
done
echo "Database is ready."

# Run migrations
echo "Running migrations..."
npx prisma migrate deploy

# Build the application
echo "Building the application..."
npm run build

# Start the application
echo "Starting the application..."
npm start
