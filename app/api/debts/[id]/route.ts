import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const debtUpdateSchema = z.object({
  amount: z.number().positive("Amount must be positive").optional(),
  description: z.string().min(1, "Description is required").optional(),
  type: z.enum(["ACCOUNTS_RECEIVABLE", "ACCOUNTS_PAYABLE"]).optional(),
  date: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  dueDate: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  isPaid: z.boolean().optional(),
  creditor: z.string().optional(),
  debtor: z.string().optional(),
  notes: z.string().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = debtUpdateSchema.parse(body);

    const debt = await prisma.debt.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(debt);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error updating debt:", error);
    return NextResponse.json(
      { error: "Failed to update debt" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.debt.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Debt deleted successfully" });
  } catch (error) {
    console.error("Error deleting debt:", error);
    return NextResponse.json(
      { error: "Failed to delete debt" },
      { status: 500 }
    );
  }
}
