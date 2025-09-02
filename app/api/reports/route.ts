import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const dateFilter: { gte?: Date; lte?: Date } = {};
    if (startDate || endDate) {
      if (startDate) {
        dateFilter.gte = new Date(startDate);
      }
      if (endDate) {
        dateFilter.lte = new Date(endDate);
      }
    }

    // Test database connection first
    try {
      await prisma.$connect();
    } catch (dbError) {
      console.error("Database connection failed:", dbError);
      return NextResponse.json(
        {
          error: "Database connection failed",
          details: "Please check your database configuration",
        },
        { status: 503 }
      );
    }

    // Get total income from transactions
    const totalIncomeTransactions = await prisma.transaction.aggregate({
      where: {
        type: "INCOME",
        date: Object.keys(dateFilter).length > 0 ? dateFilter : undefined,
      },
      _sum: {
        amount: true,
      },
    });

    // Get total expenses from transactions
    const totalExpenseTransactions = await prisma.transaction.aggregate({
      where: {
        type: "EXPENSE",
        date: Object.keys(dateFilter).length > 0 ? dateFilter : undefined,
      },
      _sum: {
        amount: true,
      },
    });

    // Get total income (based on received amounts from income model)
    const totalIncome = await prisma.income.aggregate({
      where: {
        date: Object.keys(dateFilter).length > 0 ? dateFilter : undefined,
      },
      _sum: {
        receivedAmount: true,
      },
    });

    // Get total expenses (based on paid amounts from expense model)
    const totalExpenses = await prisma.expense.aggregate({
      where: {
        date: Object.keys(dateFilter).length > 0 ? dateFilter : undefined,
      },
      _sum: {
        paidAmount: true,
      },
    });

    // Get total accounts receivable (unpaid debts)
    const totalAccountsReceivable = await prisma.debt.aggregate({
      where: {
        type: "ACCOUNTS_RECEIVABLE",
        isPaid: false,
      },
      _sum: {
        amount: true,
      },
    });

    // Get total accounts payable (unpaid debts)
    const totalAccountsPayable = await prisma.debt.aggregate({
      where: {
        type: "ACCOUNTS_PAYABLE",
        isPaid: false,
      },
      _sum: {
        amount: true,
      },
    });

    // Get income by category from transactions
    const incomeByCategory = await prisma.transaction.groupBy({
      by: ["categoryId"],
      where: {
        type: "INCOME",
        date: Object.keys(dateFilter).length > 0 ? dateFilter : undefined,
      },
      _sum: {
        amount: true,
      },
    });

    // Get expenses by category from transactions
    const expensesByCategory = await prisma.transaction.groupBy({
      by: ["categoryId"],
      where: {
        type: "EXPENSE",
        date: Object.keys(dateFilter).length > 0 ? dateFilter : undefined,
      },
      _sum: {
        amount: true,
      },
    });

    // Get categories for mapping
    const categories = await prisma.category.findMany();

    // Map category names to amounts
    const incomeByCategoryWithNames = incomeByCategory.map((item) => {
      const category = categories.find((cat) => cat.id === item.categoryId);
      return {
        categoryName: category?.name || "Unknown",
        categoryColor: category?.color || "#3B82F6",
        amount: item._sum.amount || 0,
      };
    });

    const expensesByCategoryWithNames = expensesByCategory.map((item) => {
      const category = categories.find((cat) => cat.id === item.categoryId);
      return {
        categoryName: category?.name || "Unknown",
        categoryColor: category?.color || "#3B82F6",
        amount: item._sum.amount || 0,
      };
    });

    // Calculate net profit using transaction amounts for more accurate data
    const incomeAmount = Number(totalIncomeTransactions._sum.amount) || 0;
    const expenseAmount = Number(totalExpenseTransactions._sum.amount) || 0;
    const netProfit = incomeAmount - expenseAmount;

    const report = {
      totalIncome: incomeAmount,
      totalExpenses: expenseAmount,
      netProfit,
      totalAccountsReceivable: Number(totalAccountsReceivable._sum.amount) || 0,
      totalAccountsPayable: Number(totalAccountsPayable._sum.amount) || 0,
      incomeByCategory: incomeByCategoryWithNames.map((item) => ({
        ...item,
        amount: Number(item.amount),
      })),
      expensesByCategory: expensesByCategoryWithNames.map((item) => ({
        ...item,
        amount: Number(item.amount),
      })),
      period: {
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    };

    return NextResponse.json(report);
  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json(
      {
        error: "Failed to generate report",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
