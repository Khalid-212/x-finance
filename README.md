# X Finance - Financial Management Platform

A comprehensive finance management platform built with Next.js, PostgreSQL, Prisma, and shadcn/ui for tracking income, expenses, and debt management with detailed financial reporting.

## Features

- **Transaction Management**: Track income and expenses with customizable categories
- **Category Management**: Create and manage transaction categories with color coding
- **Debt Management**: Handle accounts receivable and accounts payable
- **Financial Reports**: Generate detailed reports with charts and analytics
- **Dashboard**: Real-time overview of financial metrics
- **Responsive Design**: Modern UI built with shadcn/ui components

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **UI Components**: shadcn/ui with Tailwind CSS
- **Charts**: Recharts for data visualization
- **Form Handling**: React Hook Form with Zod validation

## Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn package manager

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd x-finance
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   echo 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/x_finance"' > .env.local
   ```

   Update the connection string with your PostgreSQL credentials:

   - `postgres`: username
   - `postgres`: password
   - `localhost:5432`: host and port
   - `x_finance`: database name

4. **Set up the database**

   ```bash
   # Generate Prisma client
   npm run db:generate

   # Push schema to database
   npm run db:push

   # Seed with sample data (optional)
   npm run db:seed
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Setup

The application uses PostgreSQL with the following main tables:

- **categories**: Transaction categories (income, expense, or both)
- **transactions**: General income and expense transactions
- **expenses**: Detailed expense records
- **incomes**: Detailed income records
- **debts**: Accounts receivable and payable

## API Endpoints

### Categories

- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/[id]` - Update category
- `DELETE /api/categories/[id]` - Delete category

### Transactions

- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/[id]` - Update transaction
- `DELETE /api/transactions/[id]` - Delete transaction

### Expenses

- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create new expense

### Incomes

- `GET /api/incomes` - Get all incomes
- `POST /api/incomes` - Create new income

### Debts

- `GET /api/debts` - Get all debts
- `POST /api/debts` - Create new debt
- `PUT /api/debts/[id]` - Update debt
- `DELETE /api/debts/[id]` - Delete debt

### Reports

- `GET /api/reports` - Get financial reports and analytics

## Usage

### Getting Started

1. **Create Categories**: Start by creating categories for your income and expenses
2. **Add Transactions**: Record your financial transactions
3. **Manage Debts**: Track accounts receivable and payable
4. **View Reports**: Analyze your financial data with charts and metrics

### Dashboard

The dashboard provides:

- Total income and expenses
- Net profit calculation
- Accounts receivable and payable
- Category-wise breakdown charts
- Financial ratios and metrics

### Categories

Create customizable categories with:

- Name and description
- Type (Income, Expense, or Both)
- Color coding for visual organization

### Transactions

Record transactions with:

- Amount and description
- Category assignment
- Date and due date
- Payment status
- Additional notes

### Debt Management

Track debts with:

- Amount and description
- Type (Receivable or Payable)
- Creditor/Debtor information
- Interest rates
- Payment status

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Prisma Studio
- `npm run db:migrate` - Run database migrations
- `npm run db:reset` - Reset database
- `npm run db:seed` - Seed database with sample data

### Project Structure

```
x-finance/
├── app/
│   ├── api/                 # API routes
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main dashboard
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── DashboardOverview.tsx
│   ├── TransactionsList.tsx
│   ├── CategoriesManager.tsx
│   ├── DebtManager.tsx
│   └── ReportsView.tsx
├── lib/
│   └── utils.ts             # Utility functions
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Sample data
└── public/                  # Static assets
```

## Troubleshooting

### Database Issues

If you encounter database connection errors:

1. Make sure PostgreSQL is running and accessible
2. Verify your database credentials in `.env.local`
3. Ensure the `x_finance` database exists
4. Run `npm run db:push` to sync the schema
5. Run `npm run db:seed` to populate with sample data

### Styling Issues

If styles appear broken:

1. Make sure Tailwind CSS is properly configured
2. Check that `app/globals.css` is imported in `app/layout.tsx`
3. Restart the development server

### API Errors

If API endpoints return errors:

1. Check the browser console for detailed error messages
2. Verify the database is properly set up
3. Check the server logs for backend errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
