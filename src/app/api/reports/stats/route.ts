import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Dashboard statistics
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch all data needed for calculations
    const [sales, debts, products, saleItems, hardwares, user] = await Promise.all([
      prisma.sale.findMany({ where: { deletedAt: null, userId } }),
      prisma.debt.findMany({ where: { userId } }),
      prisma.product.findMany({ where: { userId } }),
      prisma.saleItem.findMany({
        include: {
          product: true,
          sale: true,
        },
        where: {
          sale: {
            deletedAt: null,
            userId,
          },
        },
      }),
      prisma.hardware.findMany({
        where: { userId },
        include: { list: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          storeName: true,
          storeLocation: true,
          storeDescription: true,
        },
      }),
    ]);

    // Calculate statistics
    const totalRevenue = (sales as any[])
      .filter((s: any) => s.paymentStatus === "PAID")
      .reduce((sum: number, s: any) => sum + s.totalAmount, 0);

    const itemsSold = (saleItems as any[]).reduce((sum: number, item: any) => sum + item.quantity, 0);

    const totalDebts = (debts as any[]).reduce((sum: number, d: any) => sum + d.amount, 0);

    const debtsCollected = (debts as any[]).reduce((sum: number, d: any) => sum + d.amountPaid, 0);

    const debtsPending = totalDebts - debtsCollected;

    const lowStockItems = (products as any[]).filter(
      (p: any) => p.currentStock <= p.minStockLevel
    );

    // Calculate profit (cost of goods sold)
    const costOfGoodsSold = (saleItems as any[]).reduce((sum: number, item: any) => {
      return sum + item.product.purchasePrice * item.quantity;
    }, 0);

    const profit = totalRevenue - costOfGoodsSold;
    const hardwareValue = (hardwares as any[]).reduce((sum: number, item: any) => sum + item.quantity * item.purchasePrice, 0);
    const hardwareItems = (hardwares as any[]).map((item: any) => ({
      id: item.id,
      name: item.name,
      sku: item.sku,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      purchasePrice: item.purchasePrice,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      listName: item.list?.name || "Unassigned",
      description: item.description,
    }));

    return NextResponse.json({
      totalRevenue,
      itemsSold,
      totalDebts,
      debtsCollected,
      debtsPending,
      profit,
      lowStockItems: lowStockItems.length,
      lowStockProducts: lowStockItems,
      storeName: user?.storeName || "My Hardware Store",
      storeLocation: user?.storeLocation || "",
      storeDescription: user?.storeDescription || "",
      hardwareCount: hardwareItems.length,
      hardwareValue,
      hardwareItems,
    });
  } catch (error) {
    console.error("/api/reports/stats GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
