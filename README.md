# X-Finance

A comprehensive financial management application built with Next.js, Prisma, and PostgreSQL.

## Features

- **Cash Management**: Track cash balances across different locations and payment methods
- **Transaction Management**: Record and categorize income and expenses
- **Debt Tracking**: Monitor accounts receivable and payable
- **Category Management**: Organize transactions with customizable categories
- **Financial Reports**: Generate insights and reports on your financial data
- **Responsive Design**: Modern UI that works on all devices

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd x-finance
```

2. Install dependencies:

```bash
npm install
```

3. Set up your environment variables:

```bash
# Copy the environment template
cp env.example .env.local

# Edit .env.local with your database connection
DATABASE_URL="postgresql://username:password@localhost:5432/x_finance"
```

4. Set up the database:

```bash
# Generate Prisma client
npm run db:generate

# Push the schema to your database (creates tables)
npm run db:push

# Seed the database with sample data
npm run db:seed
```

5. Start the development server:

```bash
npm run dev
```

## Database Setup

If you're getting a 503 "Service Unavailable" error, it usually means the database isn't set up yet. Follow these steps:

### Option 1: Quick Setup (Recommended for development)

```bash
npm run db:push    # Creates all tables
npm run db:seed    # Adds sample data
```

### Option 2: Full Migration Setup (Recommended for production)

```bash
npm run db:migrate # Creates and runs migrations
npm run db:seed    # Adds sample data
```

### Option 3: Reset and Start Fresh

```bash
npm run db:reset   # Drops all tables and recreates them
npm run db:seed    # Adds sample data
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:reset` - Reset database (drops all tables)
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

## Database Schema

The application includes the following main models:

- **CashBalance**: Track cash across different locations
- **Category**: Organize transactions by type
- **Transaction**: Record income and expenses
- **Debt**: Track accounts receivable and payable
- **Expense**: Detailed expense tracking
- **Income**: Detailed income tracking

## Troubleshooting

### Common Issues

1. **503 Service Unavailable**: Database not connected or tables don't exist

   - Solution: Run `npm run db:push` and `npm run db:seed`

2. **Database connection failed**: Check your DATABASE_URL in .env.local

   - Ensure PostgreSQL is running
   - Verify connection string format

3. **Tables don't exist**: Run database setup commands
   - `npm run db:push` for quick setup
   - `npm run db:migrate` for production setup

### Getting Help

If you're still experiencing issues:

1. Check the browser console for detailed error messages
2. Verify your database connection string
3. Ensure PostgreSQL is running and accessible
4. Check the server logs for additional error details

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
