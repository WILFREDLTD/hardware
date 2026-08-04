'use client';

import { Section } from '../Section';
import { formatKES } from '@/lib/utils';
import type { Expense } from './types';

interface ExpenseTransactionsProps {
  filteredExpenses: Expense[];
  openEditExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
}

export function ExpenseTransactions({ filteredExpenses, openEditExpense, onDeleteExpense }: ExpenseTransactionsProps) {
  return (
    <Section
      title="Expense transactions"
      subtitle={`${filteredExpenses.length} item${filteredExpenses.length !== 1 ? 's' : ''} found`}
      action={<div className="text-xs text-slate-500">Tap an item to edit</div>}
    >
      <div className="space-y-4 md:hidden">
        {filteredExpenses.map(expense => (
          <div key={expense.id} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-500">Category</p>
                  <p className="font-medium text-slate-900">{expense.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] uppercase tracking-wider text-slate-500">Payment</p>
                  <p className="font-medium text-slate-900">{expense.paymentMethod}</p>
                </div>

                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-500">Date</p>
                  <p className="text-slate-700">{new Date(expense.date).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] uppercase tracking-wider text-slate-500">Amount</p>
                  <p className="font-bold text-slate-900">KES {formatKES(expense.amount)}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => openEditExpense(expense)}
                  className="rounded-2xl border border-slate-200 bg-slate-50 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteExpense(expense.id)}
                  className="rounded-2xl border border-red-100 bg-red-50 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredExpenses.length === 0 && (
          <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
            No expenses match this filter.
          </div>
        )}
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {['Date', 'Category', 'Title', 'Amount', 'Payment', 'Actions'].map(header => (
                <th key={header} className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-[0.16em]">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map(expense => (
              <tr key={expense.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                <td className="py-4 px-3 text-slate-600 text-xs">{new Date(expense.date).toLocaleDateString('en-KE')}</td>
                <td className="py-4 px-3 font-medium text-slate-900">{expense.category}</td>
                <td className="py-4 px-3 text-slate-700">{expense.title}</td>
                <td className="py-4 px-3 font-semibold text-slate-900">KES {formatKES(expense.amount)}</td>
                <td className="py-4 px-3 text-slate-600">{expense.paymentMethod}</td>
                <td className="py-4 px-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => openEditExpense(expense)}
                      className="rounded-2xl bg-white px-3 py-2 text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 transition"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteExpense(expense.id)}
                      className="rounded-2xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 border border-red-100 hover:bg-red-100 transition"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
