import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  sku: z.string().min(1),
  currentStock: z.number().int().nonnegative().optional(),
  minStockLevel: z.number().int().nonnegative().optional(),
  unitPrice: z.number().nonnegative().optional(),
  purchasePrice: z.number().nonnegative().optional(),
  baseUnit: z.string().min(1),
  packageUnitLabel: z.string().optional(),
  packageSize: z.number().int().nonnegative().optional(),
});

// GET - List all products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
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

      const product = await prisma.product.create({
        data: {
          name: data.name,
          category: data.category,
          sku: data.sku,
          baseUnit: data.baseUnit,
          packageUnitLabel: data.packageUnitLabel,
          packageSize: data.packageSize,
          currentStock: data.currentStock ?? 0,
          minStockLevel: data.minStockLevel ?? 0,
          unitPrice: data.unitPrice ?? 0,
          purchasePrice: data.purchasePrice ?? 0,
        },
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
      sku: z.string().min(1).optional(),
      currentStock: z.number().int().nonnegative().optional(),
      minStockLevel: z.number().int().nonnegative().optional(),
      unitPrice: z.number().nonnegative().optional(),
      purchasePrice: z.number().nonnegative().optional(),
      baseUnit: z.string().min(1).optional(),
      packageUnitLabel: z.string().optional(),
      packageSize: z.number().int().nonnegative().optional(),
    });

    const validatedData = updateSchema.parse(updateData);

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(validatedData.name && { name: validatedData.name }),
        ...(validatedData.category && { category: validatedData.category }),
        ...(validatedData.sku && { sku: validatedData.sku }),
        ...(validatedData.baseUnit && { baseUnit: validatedData.baseUnit }),
        packageUnitLabel: validatedData.packageUnitLabel,
        packageSize: validatedData.packageSize,
        ...(typeof validatedData.currentStock !== 'undefined' && { currentStock: validatedData.currentStock }),
        ...(typeof validatedData.minStockLevel !== 'undefined' && { minStockLevel: validatedData.minStockLevel }),
        ...(typeof validatedData.unitPrice !== 'undefined' && { unitPrice: validatedData.unitPrice }),
        ...(typeof validatedData.purchasePrice !== 'undefined' && { purchasePrice: validatedData.purchasePrice }),
      },
    });

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
