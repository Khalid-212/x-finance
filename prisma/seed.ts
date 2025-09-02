import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create sample categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Salary",
        type: "INCOME",
        color: "#10B981",
        description: "Regular employment income",
      },
    }),
    prisma.category.create({
      data: {
        name: "Freelance",
        type: "INCOME",
        color: "#3B82F6",
        description: "Freelance and contract work",
      },
    }),
    prisma.category.create({
      data: {
        name: "Food & Dining",
        type: "EXPENSE",
        color: "#EF4444",
        description: "Restaurants, groceries, and dining out",
      },
    }),
    prisma.category.create({
      data: {
        name: "Transportation",
        type: "EXPENSE",
        color: "#F59E0B",
        description: "Gas, public transport, and vehicle expenses",
      },
    }),
    prisma.category.create({
      data: {
        name: "Utilities",
        type: "EXPENSE",
        color: "#8B5CF6",
        description: "Electricity, water, internet, and phone bills",
      },
    }),
    prisma.category.create({
      data: {
        name: "Entertainment",
        type: "EXPENSE",
        color: "#EC4899",
        description: "Movies, games, and leisure activities",
      },
    }),
    prisma.category.create({
      data: {
        name: "Healthcare",
        type: "EXPENSE",
        color: "#06B6D4",
        description: "Medical expenses and health insurance",
      },
    }),
    prisma.category.create({
      data: {
        name: "Investment",
        type: "BOTH",
        color: "#84CC16",
        description: "Investment income and expenses",
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // Create sample transactions with partial payments
  const transactions = await Promise.all([
    prisma.transaction.create({
      data: {
        amount: 5000,
        description: "Monthly salary",
        date: new Date("2024-01-15"),
        type: "INCOME",
        categoryId: categories[0].id,
        isPaid: true,
        paidAmount: 5000,
        notes: "Regular monthly salary payment",
      },
    }),
    prisma.transaction.create({
      data: {
        amount: 1200,
        description: "Freelance web development",
        date: new Date("2024-01-20"),
        type: "INCOME",
        categoryId: categories[1].id,
        isPaid: false,
        paidAmount: 800, // Partial payment
        dueDate: new Date("2024-02-20"),
        notes: "Website development project - partial payment received",
      },
    }),
    prisma.transaction.create({
      data: {
        amount: 150,
        description: "Grocery shopping",
        date: new Date("2024-01-18"),
        type: "EXPENSE",
        categoryId: categories[2].id,
        isPaid: true,
        paidAmount: 150,
        notes: "Weekly groceries",
      },
    }),
    prisma.transaction.create({
      data: {
        amount: 80,
        description: "Gas station",
        date: new Date("2024-01-19"),
        type: "EXPENSE",
        categoryId: categories[3].id,
        isPaid: true,
        paidAmount: 80,
        notes: "Fuel for car",
      },
    }),
    prisma.transaction.create({
      data: {
        amount: 200,
        description: "Electricity bill",
        date: new Date("2024-01-25"),
        type: "EXPENSE",
        categoryId: categories[4].id,
        isPaid: false,
        paidAmount: 100, // Partial payment
        dueDate: new Date("2024-02-05"),
        notes: "Monthly electricity bill - partial payment made",
      },
    }),
  ]);

  console.log(`✅ Created ${transactions.length} transactions`);

  // Create sample expenses with partial payments
  const expenses = await Promise.all([
    prisma.expense.create({
      data: {
        amount: 300,
        description: "Office supplies",
        date: new Date("2024-01-22"),
        categoryId: categories[4].id,
        isPaid: false,
        paidAmount: 200, // Partial payment
        dueDate: new Date("2024-02-22"),
        vendor: "Office Depot",
        invoiceNumber: "INV-001",
        notes: "Office supplies - partial payment made",
      },
    }),
  ]);

  console.log(`✅ Created ${expenses.length} expenses`);

  // Create sample incomes with partial payments
  const incomes = await Promise.all([
    prisma.income.create({
      data: {
        amount: 2500,
        description: "Consulting project",
        date: new Date("2024-01-28"),
        categoryId: categories[1].id,
        isReceived: false,
        receivedAmount: 1500, // Partial payment
        dueDate: new Date("2024-02-28"),
        customer: "Tech Solutions Inc",
        invoiceNumber: "INV-002",
        notes: "Consulting project - partial payment received",
      },
    }),
  ]);

  console.log(`✅ Created ${incomes.length} incomes`);

  // Create sample debts (these will be auto-generated from partial payments)
  const debts = await Promise.all([
    prisma.debt.create({
      data: {
        amount: 5000,
        description: "Client payment pending",
        type: "ACCOUNTS_RECEIVABLE",
        date: new Date("2024-01-10"),
        dueDate: new Date("2024-02-10"),
        isPaid: false,
        debtor: "ABC Company",
        notes: "Website redesign project payment",
      },
    }),
    prisma.debt.create({
      data: {
        amount: 1500,
        description: "Credit card payment",
        type: "ACCOUNTS_PAYABLE",
        date: new Date("2024-01-15"),
        dueDate: new Date("2024-02-15"),
        isPaid: false,
        creditor: "Bank of America",
        notes: "Credit card balance",
      },
    }),
  ]);

  console.log(`✅ Created ${debts.length} debts`);

  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
