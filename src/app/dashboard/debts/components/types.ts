export interface Debt {
  id: string;
  debtorName: string;
  debtorPhone: string;
  amount: number;
  amountPaid: number;
  status: 'PENDING' | 'PARTIAL' | 'PAID';
  date: string;
  dueDate?: string;
}

export type DebtFilterStatus = 'all' | 'PENDING' | 'PARTIAL' | 'PAID';
