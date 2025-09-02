import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const transactionSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  description: z.string().min(1, "Description is required"),
  date: z.string().transform((str) => new Date(str)),
  type: z.enum(["INCOME", "EXPENSE"]),
  categoryId: z.string().min(1, "Category is required"),
  isPaid: z.boolean().default(true),
  paidAmount: z.number().optional(),
  dueDate: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  notes: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const categoryId = searchParams.get("categoryId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const where: any = {};

    if (type) {
      where.type = type;
    }

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

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = transactionSchema.parse(body);

    // Calculate paid amount if not provided
    let paidAmount = validatedData.paidAmount;
    if (validatedData.isPaid && !paidAmount) {
      paidAmount = validatedData.amount;
    } else if (!validatedData.isPaid && !paidAmount) {
      paidAmount = 0;
    }

    // Create the transaction
    const transaction = await prisma.transaction.create({
      data: {
        ...validatedData,
        paidAmount,
      },
      include: {
        category: true,
      },
    });

    // If transaction is not fully paid, create a debt record
    if (paidAmount && paidAmount < validatedData.amount) {
      const debtAmount = validatedData.amount - paidAmount;
      const debtType =
        validatedData.type === "INCOME"
          ? "ACCOUNTS_RECEIVABLE"
          : "ACCOUNTS_PAYABLE";

      await prisma.debt.create({
        data: {
          amount: debtAmount,
          description: `Partial payment for: ${validatedData.description}`,
          type: debtType,
          date: validatedData.date,
          dueDate: validatedData.dueDate,
          isPaid: false,
          debtor: validatedData.type === "INCOME" ? "Customer" : undefined,
          creditor: validatedData.type === "EXPENSE" ? "Vendor" : undefined,
          notes: `Remaining amount from transaction: ${validatedData.description}`,
        },
      });
    }

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}
