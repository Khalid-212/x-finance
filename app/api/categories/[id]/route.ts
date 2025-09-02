import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const categoryUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  type: z.enum(["INCOME", "EXPENSE", "BOTH"]).optional(),
  color: z.string().optional(),
  description: z.string().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validatedData = categoryUpdateSchema.parse(body);

    if (validatedData.name) {
      const existingCategory = await prisma.category.findFirst({
        where: {
          name: validatedData.name,
          id: { not: params.id },
        },
      });

      if (existingCategory) {
        return NextResponse.json(
          { error: "Category with this name already exists" },
          { status: 400 }
        );
      }
    }

    const category = await prisma.category.update({
      where: { id: params.id },
      data: validatedData,
    });

    return NextResponse.json(category);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if category is being used by any transactions
    const transactionsCount = await prisma.transaction.count({
      where: { categoryId: params.id },
    });

    const expensesCount = await prisma.expense.count({
      where: { categoryId: params.id },
    });

    const incomesCount = await prisma.income.count({
      where: { categoryId: params.id },
    });

    if (transactionsCount > 0 || expensesCount > 0 || incomesCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete category that is being used by transactions" },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
