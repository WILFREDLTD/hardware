import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Dashboard statistics
export async function GET() {
  try {
    // Fetch all data needed for calculations
    const [sales, debts, products, saleItems] = await Promise.all([
      prisma.sale.findMany(),
      prisma.debt.findMany(),
      prisma.product.findMany(),
      prisma.saleItem.findMany({
        include: {
          product: true,
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

    return NextResponse.json({
      totalRevenue,
      itemsSold,
      totalDebts,
      debtsCollected,
      debtsPending,
      profit,
      lowStockItems: lowStockItems.length,
      lowStockProducts: lowStockItems,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
