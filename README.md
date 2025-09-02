# X Finance

A comprehensive financial management application built with Next.js 15, Prisma, and TypeScript.

## Features

- **Dashboard Overview**: Financial summary with charts and metrics
- **Transaction Management**: Track income and expenses
- **Category Management**: Organize transactions by categories
- **Debt Tracking**: Monitor accounts receivable and payable
- **Financial Reports**: Detailed analysis and insights
- **Responsive Design**: Modern UI built with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Database**: PostgreSQL with Prisma ORM
- **Charts**: Recharts for data visualization
- **Validation**: Zod for schema validation

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Khalid-212/x-finance.git
cd x-finance
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your database connection:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/x_finance"
```

4. Set up the database:

```bash
# Push the schema to your database
npm run db:push

# Generate Prisma client
npm run db:generate

# Seed the database (optional)
npm run db:seed
```

5. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Prisma Studio
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed the database

## Deployment

### Vercel Deployment

This application is configured for Vercel deployment with the following setup:

1. **Build Configuration**: The build script automatically generates the Prisma client before building
2. **Postinstall Hook**: Prisma client is generated after dependencies are installed
3. **Environment Variables**: Set `DATABASE_URL` in your Vercel project settings

#### Environment Variables Required:

- `DATABASE_URL`: Your PostgreSQL connection string

#### Build Process:

The build process includes:

1. `prisma generate` - Generates the Prisma client
2. `next build --turbopack` - Builds the Next.js application

### Database Setup

For production deployment, ensure your PostgreSQL database:

1. **Connection**: Is accessible from Vercel's servers
2. **SSL**: Has SSL enabled (required for production)
3. **Schema**: Has the required tables created via `prisma db push`

## Project Structure

```
x-finance/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/             # React components
│   ├── ui/                # UI components
│   ├── DashboardOverview.tsx
│   ├── CategoriesManager.tsx
│   ├── DebtManager.tsx
│   ├── ReportsView.tsx
│   └── TransactionsList.tsx
├── lib/                    # Utility functions
│   ├── types.ts           # TypeScript types
│   └── utils.ts           # Helper functions
├── prisma/                 # Database schema and migrations
│   ├── schema.prisma      # Prisma schema
│   └── seed.ts            # Database seed script
└── public/                 # Static assets
```

## Database Schema

The application uses the following main models:

- **Category**: Transaction categories (Income/Expense/Both)
- **Transaction**: General financial transactions
- **Expense**: Detailed expense tracking
- **Income**: Detailed income tracking
- **Debt**: Accounts receivable and payable

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository.
