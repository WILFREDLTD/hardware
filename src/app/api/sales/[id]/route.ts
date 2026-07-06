import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const saleUpdateSchema = z.object({
  paymentStatus: z.enum(["PAID", "DEBT"]).optional(),
  debtorName: z.string().optional(),
  debtorPhone: z.string().optional(),
  items: z
    .array(
      z.object({
        id: z.string(),
        quantity: z.number().int().positive().optional(),
        remove: z.boolean().optional(),
      })
    )
    .optional(),
});

const deleteSchema = z.object({
  deletionReason: z.string().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { paymentStatus, debtorName, debtorPhone } = saleUpdateSchema.parse(body);

    const sale = await prisma.sale.findUnique({
      where: { id },
      include: {
        saleItems: {
          include: {
            product: true,
          },
        },
        debt: true,
      },
    });

    if (!sale || sale.deletedAt) {
      return NextResponse.json({ error: "Sale not found" }, { status: 404 });
    }

    const items = body.items as Array<{ id: string; quantity?: number; remove?: boolean }> | undefined;
    const transactionOperations: any[] = [];
    const saleUpdateData: any = {};
    let updatedTotal = sale.totalAmount;
    let itemsChanged = false;

    if (items?.length) {
      for (const itemUpdate of items) {
        const currentItem = sale.saleItems.find((item: { id: string }) => item.id === itemUpdate.id);
        if (!currentItem) {
          return NextResponse.json({ error: "Sale item not found" }, { status: 400 });
        }

        if (itemUpdate.remove) {
          itemsChanged = true;
          updatedTotal -= currentItem.total;
          transactionOperations.push(
            prisma.product.update({
              where: { id: currentItem.productId },
              data: { currentStock: { increment: currentItem.quantity } },
            })
          );
          transactionOperations.push(
            prisma.inventoryTransaction.create({
              data: {
                productId: currentItem.productId,
                type: "IN",
                quantity: currentItem.quantity,
                notes: `Sale item removed: ${sale.id}`,
              },
            })
          );
          transactionOperations.push(prisma.saleItem.delete({ where: { id: currentItem.id } }));
          continue;
        }

        if (typeof itemUpdate.quantity === "number" && itemUpdate.quantity !== currentItem.quantity) {
          itemsChanged = true;
          const previousItemTotal = currentItem.total ?? currentItem.unitPrice * currentItem.quantity;
          const newItemTotal = currentItem.quantity > 0 ? (itemUpdate.quantity / currentItem.quantity) * previousItemTotal : 0;
          updatedTotal += newItemTotal - previousItemTotal;
          const quantityDelta = itemUpdate.quantity - currentItem.quantity;

          if (quantityDelta > 0) {
            if (currentItem.product.currentStock < quantityDelta) {
              return NextResponse.json(
                { error: `Insufficient stock for ${currentItem.product.name}` },
                { status: 400 }
              );
            }
            transactionOperations.push(
              prisma.product.update({
                where: { id: currentItem.productId },
                data: { currentStock: { decrement: quantityDelta } },
              })
            );
            transactionOperations.push(
              prisma.inventoryTransaction.create({
                data: {
                  productId: currentItem.productId,
                  type: "OUT",
                  quantity: quantityDelta,
                  notes: `Sale item quantity increased: ${sale.id}`,
                },
              })
            );
          } else if (quantityDelta < 0) {
            transactionOperations.push(
              prisma.product.update({
                where: { id: currentItem.productId },
                data: { currentStock: { increment: Math.abs(quantityDelta) } },
              })
            );
            transactionOperations.push(
              prisma.inventoryTransaction.create({
                data: {
                  productId: currentItem.productId,
                  type: "IN",
                  quantity: Math.abs(quantityDelta),
                  notes: `Sale item quantity decreased: ${sale.id}`,
                },
              })
            );
          }

          transactionOperations.push(
            prisma.saleItem.update({
              where: { id: currentItem.id },
              data: {
                quantity: itemUpdate.quantity,
                total: newItemTotal,
              },
            })
          );
        }
      }

      if (itemsChanged) {
        saleUpdateData.totalAmount = updatedTotal;
        if (sale.debt) {
          transactionOperations.push(
            prisma.debt.update({
              where: { id: sale.debt.id },
              data: {
                amount: updatedTotal,
                notes: (sale.debt.notes || "") + " | Updated after sale item changes",
              },
            })
          );
        }
      }
    }

    if (paymentStatus && paymentStatus !== sale.paymentStatus) {
      saleUpdateData.paymentStatus = paymentStatus;

      if (sale.paymentStatus === "DEBT" && paymentStatus === "PAID") {
        if (sale.debt) {
          transactionOperations.push(
            prisma.debt.update({
              where: { id: sale.debt.id },
              data: {
                status: "PAID",
                amountPaid: sale.debt.amount,
                notes: (sale.debt.notes || "") + " | Marked paid after sale status update",
              },
            })
          );
        }
      } else if (sale.paymentStatus === "PAID" && paymentStatus === "DEBT") {
        if (sale.debt) {
          // Keep the existing debt record in sync with the sale.
          transactionOperations.push(
            prisma.debt.update({
              where: { id: sale.debt.id },
              data: {
                amount: updatedTotal,
                debtorName: debtorName || sale.debt.debtorName,
                debtorPhone: debtorPhone || sale.debt.debtorPhone,
              },
            })
          );
        } else {
          if (!debtorName || !debtorPhone) {
            return NextResponse.json(
              {
                error:
                  "Debtor name and phone are required to convert a paid sale into a debt sale",
              },
              { status: 400 }
            );
          }

          transactionOperations.push(
            prisma.debt.create({
              data: {
                saleId: id,
                debtorName,
                debtorPhone,
                amount: updatedTotal,
                status: "PENDING",
              },
            })
          );
        }
      }
    }

    if (Object.keys(saleUpdateData).length > 0) {
      transactionOperations.unshift(prisma.sale.update({ where: { id }, data: saleUpdateData }));
    }

    if (!itemsChanged && Object.keys(saleUpdateData).length === 0) {
      return NextResponse.json(sale);
    }

    const results = await prisma.$transaction(transactionOperations);
    const updatedSale = Array.isArray(results) ? results[0] : results;
    return NextResponse.json(updatedSale);
  } catch (error: any) {
    console.error("/api/sales/[id] PATCH error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update sale" },
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
    const body = await request.json();
    const { deletionReason } = deleteSchema.parse(body);

    const sale = await prisma.sale.findUnique({
      where: { id },
      include: {
        saleItems: true,
        debt: true,
      },
    });

    if (!sale || sale.deletedAt) {
      return NextResponse.json({ error: "Sale not found" }, { status: 404 });
    }

    const tx: any[] = [
      prisma.sale.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          deletionReason: deletionReason || null,
        },
      }),
    ];

    for (const item of sale.saleItems) {
      tx.push(
        prisma.product.update({
          where: { id: item.productId },
          data: {
            currentStock: { increment: item.quantity },
          },
        })
      );
      tx.push(
        prisma.inventoryTransaction.create({
          data: {
            productId: item.productId,
            type: "IN",
            quantity: item.quantity,
            notes: `Sale deleted: ${sale.id}`,
          },
        })
      );
    }

    if (sale.debt) {
      tx.push(prisma.debt.delete({ where: { id: sale.debt.id } }));
    }

    await prisma.$transaction(tx);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("/api/sales/[id] DELETE error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete sale" },
      { status: 500 }
    );
  }
}
