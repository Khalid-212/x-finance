import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const expenseSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  description: z.string().min(1, "Description is required"),
  date: z.string().transform((str) => new Date(str)),
  categoryId: z.string().min(1, "Category is required"),
  isPaid: z.boolean().default(true),
  paidAmount: z.number().optional(),
  dueDate: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  vendor: z.string().optional(),
  invoiceNumber: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const isPaid = searchParams.get("isPaid");

    const where: any = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        where.date.lte = new Date(endDate);
      }
    }

    if (isPaid !== null) {
      where.isPaid = isPaid === "true";
    }

    const expenses = await prisma.expense.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = expenseSchema.parse(body);

    // Calculate paid amount if not provided
    let paidAmount = validatedData.paidAmount;
    if (validatedData.isPaid && !paidAmount) {
      paidAmount = validatedData.amount;
    } else if (!validatedData.isPaid && !paidAmount) {
      paidAmount = 0;
    }

    // Create the expense
    const expense = await prisma.expense.create({
      data: {
        ...validatedData,
        paidAmount,
      },
      include: {
        category: true,
      },
    });

    // If expense is not fully paid, create a debt record
    if (paidAmount && paidAmount < validatedData.amount) {
      const debtAmount = validatedData.amount - paidAmount;

      await prisma.debt.create({
        data: {
          amount: debtAmount,
          description: `Partial payment for expense: ${validatedData.description}`,
          type: "ACCOUNTS_PAYABLE",
          date: validatedData.date,
          dueDate: validatedData.dueDate,
          isPaid: false,
          creditor: validatedData.vendor || "Vendor",
          notes: `Remaining amount from expense: ${validatedData.description}`,
        },
      });
    }

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error("Error creating expense:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 500 }
    );
  }
}
