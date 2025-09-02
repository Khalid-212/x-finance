import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const transactionUpdateSchema = z.object({
  amount: z.number().positive("Amount must be positive").optional(),
  description: z.string().min(1, "Description is required").optional(),
  date: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
  categoryId: z.string().min(1, "Category is required").optional(),
  isPaid: z.boolean().optional(),
  dueDate: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  notes: z.string().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validatedData = transactionUpdateSchema.parse(body);

    const transaction = await prisma.transaction.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        category: true,
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error updating transaction:", error);
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.transaction.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 }
    );
  }
}
