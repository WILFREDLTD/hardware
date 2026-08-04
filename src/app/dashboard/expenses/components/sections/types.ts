export interface Expense {
  id: string;
  date: string;
  category: string;
  title: string;
  amount: number;
  paymentMethod: string;
  notes?: string;
}