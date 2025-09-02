import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const incomeSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  description: z.string().min(1, "Description is required"),
  date: z.string().transform((str) => new Date(str)),
  categoryId: z.string().min(1, "Category is required"),
  isReceived: z.boolean().default(true),
  receivedAmount: z.number().optional(),
  dueDate: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  customer: z.string().optional(),
  invoiceNumber: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const isReceived = searchParams.get("isReceived");

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

    if (isReceived !== null) {
      where.isReceived = isReceived === "true";
    }

    const incomes = await prisma.income.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(incomes);
  } catch (error) {
    console.error("Error fetching incomes:", error);
    return NextResponse.json(
      { error: "Failed to fetch incomes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = incomeSchema.parse(body);

    // Calculate received amount if not provided
    let receivedAmount = validatedData.receivedAmount;
    if (validatedData.isReceived && !receivedAmount) {
      receivedAmount = validatedData.amount;
    } else if (!validatedData.isReceived && !receivedAmount) {
      receivedAmount = 0;
    }

    // Create the income
    const income = await prisma.income.create({
      data: {
        ...validatedData,
        receivedAmount,
      },
      include: {
        category: true,
      },
    });

    // If income is not fully received, create a debt record
    if (receivedAmount && receivedAmount < validatedData.amount) {
      const debtAmount = validatedData.amount - receivedAmount;

      await prisma.debt.create({
        data: {
          amount: debtAmount,
          description: `Partial payment for income: ${validatedData.description}`,
          type: "ACCOUNTS_RECEIVABLE",
          date: validatedData.date,
          dueDate: validatedData.dueDate,
          isPaid: false,
          debtor: validatedData.customer || "Customer",
          notes: `Remaining amount from income: ${validatedData.description}`,
        },
      });
    }

    return NextResponse.json(income, { status: 201 });
  } catch (error) {
    console.error("Error creating income:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create income" },
      { status: 500 }
    );
  }
}
