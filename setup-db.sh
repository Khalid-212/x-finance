#!/bin/bash

echo "🚀 Setting up X-Finance Database..."
echo "=================================="

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found!"
    echo "Please create a .env.local file with your DATABASE_URL first."
    echo "Example:"
    echo "DATABASE_URL=\"postgresql://username:password@localhost:5432/x_finance\""
    exit 1
fi

echo "✅ Environment file found"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate

# Push schema to database
echo "🗄️  Creating database tables..."
npm run db:push

# Seed database
echo "🌱 Seeding database with sample data..."
npm run db:seed

echo ""
echo "🎉 Database setup complete!"
echo "You can now start the development server with: npm run dev"
echo ""
echo "If you encounter any issues, check the troubleshooting section in README.md"
