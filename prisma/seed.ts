import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database with realistic financial data...");

  // Create comprehensive categories
  const categories = await Promise.all([
    // Income Categories
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
        name: "Investment Returns",
        type: "INCOME",
        color: "#84CC16",
        description: "Dividends and investment income",
      },
    }),
    prisma.category.create({
      data: {
        name: "Side Business",
        type: "INCOME",
        color: "#06B6D4",
        description: "E-commerce and side business income",
      },
    }),

    // Expense Categories
    prisma.category.create({
      data: {
        name: "Housing",
        type: "EXPENSE",
        color: "#EF4444",
        description: "Rent, mortgage, and housing costs",
      },
    }),
    prisma.category.create({
      data: {
        name: "Food & Dining",
        type: "EXPENSE",
        color: "#F59E0B",
        description: "Restaurants, groceries, and dining out",
      },
    }),
    prisma.category.create({
      data: {
        name: "Transportation",
        type: "EXPENSE",
        color: "#8B5CF6",
        description: "Gas, public transport, and vehicle expenses",
      },
    }),
    prisma.category.create({
      data: {
        name: "Utilities",
        type: "EXPENSE",
        color: "#EC4899",
        description: "Electricity, water, internet, and phone bills",
      },
    }),
    prisma.category.create({
      data: {
        name: "Entertainment",
        type: "EXPENSE",
        color: "#F97316",
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
        name: "Shopping",
        type: "EXPENSE",
        color: "#A855F7",
        description: "Clothing, electronics, and personal items",
      },
    }),
    prisma.category.create({
      data: {
        name: "Education",
        type: "EXPENSE",
        color: "#14B8A6",
        description: "Courses, books, and learning materials",
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // Helper function to get random date within last 6 months
  const getRandomDate = () => {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);
    const timeDiff = now.getTime() - sixMonthsAgo.getTime();
    const randomTime = sixMonthsAgo.getTime() + Math.random() * timeDiff;
    return new Date(randomTime);
  };

  // Helper function to get random amount within range
  const getRandomAmount = (min: number, max: number) => {
    return Math.round((Math.random() * (max - min) + min) * 100) / 100;
  };

  // Create realistic income transactions
  const incomeTransactions = [
    // Salary payments (monthly)
    ...Array.from({ length: 6 }, (_, i) => ({
      amount: 6500,
      description: `Monthly salary - ${new Date(2024, 0, 1).toLocaleDateString(
        "en-US",
        { month: "long", year: "numeric" }
      )}`,
      date: new Date(2024, 0, 15 + i * 30),
      type: "INCOME" as const,
      categoryId: categories[0].id, // Salary
      isPaid: true,
      paidAmount: 6500,
      notes: "Regular monthly salary payment",
    })),

    // Freelance projects
    ...Array.from({ length: 8 }, (_, i) => ({
      amount: getRandomAmount(800, 2500),
      description: `Freelance project ${i + 1}`,
      date: getRandomDate(),
      type: "INCOME" as const,
      categoryId: categories[1].id, // Freelance
      isPaid: Math.random() > 0.3, // 70% paid
      paidAmount:
        Math.random() > 0.3
          ? getRandomAmount(800, 2500)
          : getRandomAmount(400, 1200),
      dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
      notes: "Web development and consulting work",
    })),

    // Investment returns
    ...Array.from({ length: 4 }, (_, i) => ({
      amount: getRandomAmount(200, 800),
      description: `Investment dividend payment`,
      date: getRandomDate(),
      type: "INCOME" as const,
      categoryId: categories[2].id, // Investment Returns
      isPaid: true,
      paidAmount: getRandomAmount(200, 800),
      notes: "Quarterly dividend from investment portfolio",
    })),

    // Side business income
    ...Array.from({ length: 6 }, (_, i) => ({
      amount: getRandomAmount(300, 1200),
      description: `E-commerce sales`,
      date: getRandomDate(),
      type: "INCOME" as const,
      categoryId: categories[3].id, // Side Business
      isPaid: Math.random() > 0.2, // 80% paid
      paidAmount:
        Math.random() > 0.2
          ? getRandomAmount(300, 1200)
          : getRandomAmount(150, 600),
      notes: "Online store sales and affiliate income",
    })),
  ];

  // Create realistic expense transactions
  const expenseTransactions = [
    // Housing expenses (monthly)
    ...Array.from({ length: 6 }, (_, i) => ({
      amount: 2200,
      description: `Rent payment`,
      date: new Date(2024, 0, 1 + i * 30),
      type: "EXPENSE" as const,
      categoryId: categories[4].id, // Housing
      isPaid: true,
      paidAmount: 2200,
      notes: "Monthly rent payment",
    })),

    // Food & dining (weekly)
    ...Array.from({ length: 24 }, (_, i) => ({
      amount: getRandomAmount(80, 200),
      description: `Grocery shopping`,
      date: getRandomDate(),
      type: "EXPENSE" as const,
      categoryId: categories[5].id, // Food & Dining
      isPaid: true,
      paidAmount: getRandomAmount(80, 200),
      notes: "Weekly groceries and dining out",
    })),

    // Transportation (monthly)
    ...Array.from({ length: 6 }, (_, i) => ({
      amount: getRandomAmount(150, 300),
      description: `Gas and transportation`,
      date: getRandomDate(),
      type: "EXPENSE" as const,
      categoryId: categories[6].id, // Transportation
      isPaid: true,
      paidAmount: getRandomAmount(150, 300),
      notes: "Fuel, public transport, and vehicle maintenance",
    })),

    // Utilities (monthly)
    ...Array.from({ length: 6 }, (_, i) => ({
      amount: getRandomAmount(200, 400),
      description: `Utilities bill`,
      date: getRandomDate(),
      type: "EXPENSE" as const,
      categoryId: categories[7].id, // Utilities
      isPaid: Math.random() > 0.1, // 90% paid
      paidAmount:
        Math.random() > 0.1
          ? getRandomAmount(200, 400)
          : getRandomAmount(100, 200),
      notes: "Electricity, water, internet, and phone bills",
    })),

    // Entertainment (monthly)
    ...Array.from({ length: 6 }, (_, i) => ({
      amount: getRandomAmount(100, 300),
      description: `Entertainment expenses`,
      date: getRandomDate(),
      type: "EXPENSE" as const,
      categoryId: categories[8].id, // Entertainment
      isPaid: true,
      paidAmount: getRandomAmount(100, 300),
      notes: "Movies, games, and leisure activities",
    })),

    // Healthcare (quarterly)
    ...Array.from({ length: 2 }, (_, i) => ({
      amount: getRandomAmount(150, 500),
      description: `Healthcare expenses`,
      date: getRandomDate(),
      type: "EXPENSE" as const,
      categoryId: categories[9].id, // Healthcare
      isPaid: true,
      paidAmount: getRandomAmount(150, 500),
      notes: "Medical checkups and health insurance",
    })),

    // Shopping (monthly)
    ...Array.from({ length: 6 }, (_, i) => ({
      amount: getRandomAmount(200, 600),
      description: `Personal shopping`,
      date: getRandomDate(),
      type: "EXPENSE" as const,
      categoryId: categories[10].id, // Shopping
      isPaid: Math.random() > 0.2, // 80% paid
      paidAmount:
        Math.random() > 0.2
          ? getRandomAmount(200, 600)
          : getRandomAmount(100, 300),
      notes: "Clothing, electronics, and personal items",
    })),

    // Education (quarterly)
    ...Array.from({ length: 2 }, (_, i) => ({
      amount: getRandomAmount(300, 800),
      description: `Education and courses`,
      date: getRandomDate(),
      type: "EXPENSE" as const,
      categoryId: categories[11].id, // Education
      isPaid: true,
      paidAmount: getRandomAmount(300, 800),
      notes: "Online courses and learning materials",
    })),
  ];

  // Create all transactions
  const allTransactions = [...incomeTransactions, ...expenseTransactions];

  for (const transaction of allTransactions) {
    await prisma.transaction.create({
      data: transaction,
    });
  }

  console.log(`✅ Created ${allTransactions.length} transactions`);

  // Create some outstanding debts from unpaid transactions
  const unpaidTransactions = allTransactions.filter((t) => !t.isPaid);

  for (const transaction of unpaidTransactions) {
    const debtAmount = transaction.amount - (transaction.paidAmount || 0);
    if (debtAmount > 0) {
      await prisma.debt.create({
        data: {
          amount: debtAmount,
          description: `Outstanding payment for: ${transaction.description}`,
          type:
            transaction.type === "INCOME"
              ? "ACCOUNTS_RECEIVABLE"
              : "ACCOUNTS_PAYABLE",
          date: transaction.date,
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          isPaid: false,
          debtor: transaction.type === "INCOME" ? "Client" : undefined,
          creditor: transaction.type === "EXPENSE" ? "Vendor" : undefined,
          notes: `Remaining amount from ${transaction.description}`,
        },
      });
    }
  }

  // Create additional standalone debts
  const additionalDebts = [
    {
      amount: 5000,
      description: "Client payment pending - Website redesign",
      type: "ACCOUNTS_RECEIVABLE" as const,
      date: new Date(2024, 0, 10),
      dueDate: new Date(2024, 2, 10),
      isPaid: false,
      debtor: "ABC Company",
      notes: "Website redesign project - payment due in 60 days",
    },
    {
      amount: 2500,
      description: "Credit card balance",
      type: "ACCOUNTS_PAYABLE" as const,
      date: new Date(2024, 0, 15),
      dueDate: new Date(2024, 1, 15),
      isPaid: false,
      creditor: "Bank of America",
      notes: "Credit card balance from holiday shopping",
    },
    {
      amount: 800,
      description: "Medical bill",
      type: "ACCOUNTS_PAYABLE" as const,
      date: new Date(2024, 0, 20),
      dueDate: new Date(2024, 2, 20),
      isPaid: false,
      creditor: "City Medical Center",
      notes: "Annual physical examination",
    },
  ];

  for (const debt of additionalDebts) {
    await prisma.debt.create({
      data: debt,
    });
  }

  console.log(`✅ Created debts from unpaid transactions and additional debts`);

  // Create initial cash balances for different locations
  const cashBalances = await Promise.all([
    prisma.cashBalance.create({
      data: {
        location: "Cash at Hand",
        balance: 5000, // Starting with $5,000 cash
        notes: "Physical cash available for immediate use",
      },
    }),
    prisma.cashBalance.create({
      data: {
        location: "CBE Bank",
        balance: 15000, // Starting with $15,000 in CBE
        notes: "Commercial Bank of Ethiopia account",
      },
    }),
    prisma.cashBalance.create({
      data: {
        location: "Abyssinia Bank",
        balance: 10000, // Starting with $10,000 in Abyssinia
        notes: "Abyssinia Bank account",
      },
    }),
    prisma.cashBalance.create({
      data: {
        location: "Telebirr",
        balance: 2000, // Starting with $2,000 in Telebirr
        notes: "Mobile money account",
      },
    }),
    prisma.cashBalance.create({
      data: {
        location: "CBE Birr",
        balance: 3000, // Starting with $3,000 in CBE Birr
        notes: "CBE mobile banking account",
      },
    }),
  ]);

  console.log(`✅ Created ${cashBalances.length} cash balance locations`);

  console.log("🎉 Database seeded successfully with realistic financial data!");
  console.log("📊 Dashboard will now show:");
  console.log("   - Monthly salary: $6,500");
  console.log("   - Freelance income: $800-$2,500 per project");
  console.log("   - Investment returns: $200-$800 quarterly");
  console.log("   - Side business: $300-$1,200 monthly");
  console.log("   - Housing: $2,200 monthly");
  console.log("   - Food: $80-$200 weekly");
  console.log("   - Transportation: $150-$300 monthly");
  console.log("   - Utilities: $200-$400 monthly");
  console.log("   - Entertainment: $100-$300 monthly");
  console.log("   - Healthcare: $150-$500 quarterly");
  console.log("   - Shopping: $200-$600 monthly");
  console.log("   - Education: $300-$800 quarterly");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
