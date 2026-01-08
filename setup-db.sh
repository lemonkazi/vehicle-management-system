#!/bin/bash

echo "🚀 Setting up database..."

# Wait for MySQL to be ready
echo "⏳ Waiting for MySQL to start..."
while ! docker exec vehicle-mysql mysqladmin ping --silent; do
    sleep 5
    echo "⏳ Still waiting..."
done

echo "✅ MySQL is ready!"

# Run Prisma migrations
echo "🔨 Running Prisma migrations..."
docker exec vehicle-app npx prisma db push

# Seed the database
echo "🌱 Seeding database..."
docker exec vehicle-app npm run db:seed

echo "🎉 Setup complete! Access the application at http://localhost:3000"


# Start containers
# docker-compose up -d

# # Wait for MySQL to be ready
# sleep 30

# # Setup database (run in app container)
docker exec vehicle-app npx prisma db push
docker exec vehicle-app npm run db:seed
docker-compose exec app npx prisma migrate deploy