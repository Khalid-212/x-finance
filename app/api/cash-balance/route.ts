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
          details:
            "Please check your database configuration and ensure the database is running",
          suggestion:
            "If this is a new deployment, you may need to run database migrations and seed the database",
        },
        { status: 503 }
      );
    }

    // Check if the cash_balances table exists and has data
    try {
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
    } catch (queryError) {
      console.error("Database query failed:", queryError);

      // Check if this is a table doesn't exist error
      if (
        queryError instanceof Error &&
        queryError.message.includes("does not exist")
      ) {
        return NextResponse.json(
          {
            error: "Database table not found",
            details:
              "The cash_balances table does not exist. Please run database migrations first.",
            suggestion:
              "Run 'npm run db:migrate' or 'npm run db:push' to create the database schema",
          },
          { status: 503 }
        );
      }

      return NextResponse.json(
        {
          error: "Database query failed",
          details:
            queryError instanceof Error
              ? queryError.message
              : "Unknown database error",
          suggestion:
            "Please check your database schema and ensure all tables are properly created",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Unexpected error in cash balance API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details:
          error instanceof Error ? error.message : "Unknown error occurred",
        suggestion: "Please check the server logs for more details",
      },
      { status: 500 }
    );
  } finally {
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.error("Error disconnecting from database:", disconnectError);
    }
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
