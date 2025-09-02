import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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
    const { balance, notes } = body;

    if (balance === undefined) {
      return NextResponse.json(
        { error: "Balance is required" },
        { status: 400 }
      );
    }

    const cashBalance = await prisma.cashBalance.update({
      where: { id },
      data: {
        balance: parseFloat(balance),
        notes,
        lastUpdated: new Date(),
      },
    });

    return NextResponse.json(cashBalance);
  } catch (error) {
    console.error("Error updating cash balance:", error);
    return NextResponse.json(
      {
        error: "Failed to update cash balance",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    await prisma.cashBalance.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Cash balance deleted successfully" });
  } catch (error) {
    console.error("Error deleting cash balance:", error);
    return NextResponse.json(
      {
        error: "Failed to delete cash balance",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
