@echo off
echo 🚀 Setting up X-Finance Database...
echo ==================================

REM Check if .env.local exists
if not exist .env.local (
    echo ❌ .env.local file not found!
    echo Please create a .env.local file with your DATABASE_URL first.
    echo Example:
    echo DATABASE_URL="postgresql://username:password@localhost:5432/x_finance"
    pause
    exit /b 1
)

echo ✅ Environment file found

REM Install dependencies if node_modules doesn't exist
if not exist node_modules (
    echo 📦 Installing dependencies...
    npm install
)

REM Generate Prisma client
echo 🔧 Generating Prisma client...
npm run db:generate

REM Push schema to database
echo 🗄️  Creating database tables...
npm run db:push

REM Seed database
echo 🌱 Seeding database with sample data...
npm run db:seed

echo.
echo 🎉 Database setup complete!
echo You can now start the development server with: npm run dev
echo.
echo If you encounter any issues, check the troubleshooting section in README.md
pause
