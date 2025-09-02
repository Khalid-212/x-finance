import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const debtSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["ACCOUNTS_RECEIVABLE", "ACCOUNTS_PAYABLE"]),
  date: z.string().transform((str) => new Date(str)),
  dueDate: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  isPaid: z.boolean().optional(),
  creditor: z.string().optional(),
  debtor: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where: Prisma.DebtWhereInput = {};
    if (type) {
      where.type = type as "ACCOUNTS_RECEIVABLE" | "ACCOUNTS_PAYABLE";
    }

    // Get total count for pagination
    const totalCount = await prisma.debt.count({ where });

    const debts = await prisma.debt.findMany({
      where,
      orderBy: {
        date: "desc",
      },
      skip,
      take: limit,
    });

    return NextResponse.json({
      debts,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching debts:", error);
    return NextResponse.json(
      { error: "Failed to fetch debts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = debtSchema.parse(body);

    const debt = await prisma.debt.create({
      data: {
        amount: validatedData.amount,
        description: validatedData.description,
        type: validatedData.type,
        date: validatedData.date,
        dueDate: validatedData.dueDate,
        isPaid: validatedData.isPaid ?? false,
        creditor: validatedData.creditor,
        debtor: validatedData.debtor,
        notes: validatedData.notes,
      },
    });

    return NextResponse.json(debt, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating debt:", error);
    return NextResponse.json(
      { error: "Failed to create debt" },
      { status: 500 }
    );
  }
}
