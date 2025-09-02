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

    // Get total income (based on received amounts)
    const totalIncome = await prisma.income.aggregate({
      where: {
        date: Object.keys(dateFilter).length > 0 ? dateFilter : undefined,
      },
      _sum: {
        receivedAmount: true,
      },
    });

    // Get total expenses (based on paid amounts)
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

    // Get income by category (based on received amounts)
    const incomeByCategory = await prisma.income.groupBy({
      by: ["categoryId"],
      where: {
        date: Object.keys(dateFilter).length > 0 ? dateFilter : undefined,
      },
      _sum: {
        receivedAmount: true,
      },
    });

    // Get expenses by category (based on paid amounts)
    const expensesByCategory = await prisma.expense.groupBy({
      by: ["categoryId"],
      where: {
        date: Object.keys(dateFilter).length > 0 ? dateFilter : undefined,
      },
      _sum: {
        paidAmount: true,
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
        amount: item._sum.receivedAmount || 0,
      };
    });

    const expensesByCategoryWithNames = expensesByCategory.map((item) => {
      const category = categories.find((cat) => cat.id === item.categoryId);
      return {
        categoryName: category?.name || "Unknown",
        categoryColor: category?.color || "#3B82F6",
        amount: item._sum.paidAmount || 0,
      };
    });

    // Calculate net profit
    const incomeAmount = Number(totalIncome._sum.receivedAmount) || 0;
    const expenseAmount = Number(totalExpenses._sum.paidAmount) || 0;
    const netProfit = incomeAmount - expenseAmount;

    const report = {
      totalIncome: incomeAmount,
      totalExpenses: expenseAmount,
      netProfit,
      totalAccountsReceivable: totalAccountsReceivable._sum.amount || 0,
      totalAccountsPayable: totalAccountsPayable._sum.amount || 0,
      incomeByCategory: incomeByCategoryWithNames,
      expensesByCategory: expensesByCategoryWithNames,
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
