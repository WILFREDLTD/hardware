/**
 * Utility functions for calculations
 */

export const calculateStats = {
  /**
   * Calculate total revenue from sales
   */
  totalRevenue: (sales: any[]): number => {
    return sales.reduce((sum, sale) => {
      return sale.paymentStatus === "PAID" ? sum + sale.totalAmount : sum;
    }, 0);
  },

  /**
   * Calculate total items sold
   */
  totalItemsSold: (saleItems: any[]): number => {
    return saleItems.reduce((sum, item) => sum + item.quantity, 0);
  },

  /**
   * Calculate total debts
   */
  totalDebts: (debts: any[]): number => {
    return debts.reduce((sum, debt) => sum + debt.amount, 0);
  },

  /**
   * Calculate debts collected
   */
  debtsCollected: (debts: any[]): number => {
    return debts.reduce((sum, debt) => sum + debt.amountPaid, 0);
  },

  /**
   * Calculate pending debts amount
   */
  pendingDebts: (debts: any[]): number => {
    return debts.reduce((sum, debt) => sum + (debt.amount - debt.amountPaid), 0);
  },

  /**
   * Calculate profit
   */
  profit: (sales: any[], saleItems: any[]): number => {
    const revenue = calculateStats.totalRevenue(sales);
    const cost = saleItems.reduce((sum: number, _item: any) => {
      // This needs product data - to be used in context
      return sum;
    }, 0);
    return revenue - cost;
  },

  /**
   * Format currency
   */
  formatCurrency: (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  },

  /**
   * Format percentage
   */
  formatPercent: (value: number, total: number): string => {
    if (total === 0) return "0%";
    return ((value / total) * 100).toFixed(1) + "%";
  },
};
