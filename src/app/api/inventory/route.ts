import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function createProductWithNicknameFallback(data: Prisma.ProductCreateInput) {
  try {
    return await prisma.product.create({ data });
  } catch (error: any) {
    const isUnknownNicknameFieldError =
      error?.code === "P2022" &&
      typeof error?.message === "string" &&
      error.message.includes("nickname") &&
      error.message.includes("Unknown arg");

    if (isUnknownNicknameFieldError) {
      const { nickname, ...fallbackData } = data;
      return await prisma.product.create({ data: fallbackData });
    }
    throw error;
  }
}

async function updateProductWithNicknameFallback(id: string, data: Prisma.ProductUpdateInput) {
  try {
    return await prisma.product.update({ where: { id }, data });
  } catch (error: any) {
    const isUnknownNicknameFieldError =
      error?.code === "P2022" &&
      typeof error?.message === "string" &&
      error.message.includes("nickname") &&
      error.message.includes("Unknown arg");

    if (isUnknownNicknameFieldError) {
      const { nickname, ...fallbackData } = data;
      return await prisma.product.update({ where: { id }, data: fallbackData });
    }
    throw error;
  }
}

const supplierNumberSchema = z.preprocess((value) => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed === '' ? undefined : trimmed;
  }
  return value;
}, z.string().regex(/^(?:\d{10}|\d{12})$/, 'Supplier number must be exactly 10 or 12 digits').optional());

const productSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  nickname: z.string().optional(),
  currentStock: z.number().int().nonnegative().optional(),
  minStockLevel: z.number().int().nonnegative().optional(),
  unitPrice: z.number().nonnegative().optional(),
  purchasePrice: z.number().nonnegative().optional(),
  baseUnit: z.string().min(1),
  packageUnitLabel: z.string().optional(),
  packageSize: z.number().int().nonnegative().optional(),
  supplierName: z.string().optional(),
  supplierNumber: supplierNumberSchema,
});

// GET - List all products
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("/api/inventory GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = productSchema.parse(body);

    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const product = await createProductWithNicknameFallback({
      name: data.name,
      category: data.category,
      user: { connect: { id: session.user.id } },
      nickname: data.nickname?.trim() || null,
      baseUnit: data.baseUnit,
      packageUnitLabel: data.packageUnitLabel,
      packageSize: data.packageSize,
      supplierName: data.supplierName?.trim() || "unknown",
      supplierNumber: data.supplierNumber?.trim() || "unknown",
      currentStock: data.currentStock ?? 0,
      minStockLevel: data.minStockLevel ?? 0,
      unitPrice: data.unitPrice ?? 0,
      purchasePrice: data.purchasePrice ?? 0,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("/api/inventory POST error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 }
      );
    }

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "SKU already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

// PUT - Update product
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Validate the update data - allow partial updates
    const updateSchema = z.object({
      name: z.string().min(1).optional(),
      category: z.string().min(1).optional(),
      nickname: z.string().optional(),
      currentStock: z.number().int().nonnegative().optional(),
      minStockLevel: z.number().int().nonnegative().optional(),
      unitPrice: z.number().nonnegative().optional(),
      purchasePrice: z.number().nonnegative().optional(),
      baseUnit: z.string().min(1).optional(),
      packageUnitLabel: z.string().optional(),
      packageSize: z.number().int().nonnegative().optional(),
      supplierName: z.string().optional(),
      supplierNumber: supplierNumberSchema,
    });

    const validatedData = updateSchema.parse(updateData);

    const updatePayload: Prisma.ProductUpdateInput = {
      ...(validatedData.name && { name: validatedData.name }),
      ...(validatedData.category && { category: validatedData.category }),
      ...(typeof validatedData.nickname !== 'undefined' && { nickname: validatedData.nickname?.trim() || null }),
      ...(validatedData.baseUnit && { baseUnit: validatedData.baseUnit }),
      packageUnitLabel: validatedData.packageUnitLabel,
      packageSize: validatedData.packageSize,
      ...(typeof validatedData.supplierName !== 'undefined' && { supplierName: validatedData.supplierName?.trim() || 'unknown' }),
      ...(typeof validatedData.supplierNumber !== 'undefined' && { supplierNumber: validatedData.supplierNumber?.trim() || 'unknown' }),
      ...(typeof validatedData.currentStock !== 'undefined' && { currentStock: validatedData.currentStock }),
      ...(typeof validatedData.minStockLevel !== 'undefined' && { minStockLevel: validatedData.minStockLevel }),
      ...(typeof validatedData.unitPrice !== 'undefined' && { unitPrice: validatedData.unitPrice }),
      ...(typeof validatedData.purchasePrice !== 'undefined' && { purchasePrice: validatedData.purchasePrice }),
    };

    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const product = await updateProductWithNicknameFallback(id, updatePayload);

    return NextResponse.json(product);
  } catch (error: any) {
    console.error("/api/inventory PUT error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 }
      );
    }

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "SKU already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}
