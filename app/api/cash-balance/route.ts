import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
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

    const cashBalances = await prisma.cashBalance.findMany({
      orderBy: { location: "asc" },
    });

    // Calculate total available cash
    const totalCash = cashBalances.reduce(
      (sum, balance) => sum + Number(balance.balance),
      0
    );

    return NextResponse.json({
      cashBalances,
      totalCash,
    });
  } catch (error) {
    console.error("Error fetching cash balances:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch cash balances",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
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

    const body = await request.json();
    const { location, balance, notes } = body;

    if (!location || balance === undefined) {
      return NextResponse.json(
        { error: "Location and balance are required" },
        { status: 400 }
      );
    }

    // Check if location already exists
    const existingBalance = await prisma.cashBalance.findUnique({
      where: { location },
    });

    if (existingBalance) {
      return NextResponse.json(
        { error: "Location already exists" },
        { status: 400 }
      );
    }

    const cashBalance = await prisma.cashBalance.create({
      data: {
        location,
        balance: parseFloat(balance),
        notes,
      },
    });

    return NextResponse.json(cashBalance, { status: 201 });
  } catch (error) {
    console.error("Error creating cash balance:", error);
    return NextResponse.json(
      {
        error: "Failed to create cash balance",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
