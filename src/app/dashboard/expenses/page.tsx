'use client';

import { useState } from 'react';
import { ExpensesSection } from './components/sections/expenses';
import type { Expense } from './components/sections/types';

const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    date: '2026-08-04',
    category: 'Rent',
    title: 'July Rent',
    amount: 35000,
    paymentMethod: 'Bank',
    notes: 'Monthly shop rent',
  },
  {
    id: 'exp-2',
    date: '2026-08-04',
    category: 'Packaging',
    title: 'Cartons',
    amount: 2400,
    paymentMethod: 'Cash',
    notes: 'Boxes for deliveries',
  },
  {
    id: 'exp-3',
    date: '2026-08-05',
    category: 'Fuel',
    title: 'Delivery Vehicle',
    amount: 4500,
    paymentMethod: 'M-Pesa',
    notes: 'Fuel for customer deliveries',
  },
];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);

  return (
    <div className="space-y-6 w-full max-w-none">
      <div className="grid gap-6">
        <ExpensesSection
          expenses={expenses}
          onAddExpense={expense => setExpenses(prev => [expense, ...prev])}
          onUpdateExpense={expense => setExpenses(prev => prev.map(item => item.id === expense.id ? expense : item))}
          onDeleteExpense={id => setExpenses(prev => prev.filter(item => item.id !== id))}
        />
      </div>
    </div>
  );
}
