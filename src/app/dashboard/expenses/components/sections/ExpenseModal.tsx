'use client';

import { Modal } from '@/components/ui/Modal';
import { useEffect, useState } from 'react';
import type { Expense } from './types';
import type { Dispatch, SetStateAction } from 'react';

interface ExpenseModalProps {
  isOpen: boolean;
  isEditing: boolean;
  expenseForm: Expense;
  setExpenseForm: Dispatch<SetStateAction<Expense>>;
  closeModal: () => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  categories: string[];
  addCategory: (cat: string) => void;
}

export function ExpenseModal({
  isOpen,
  isEditing,
  expenseForm,
  setExpenseForm,
  closeModal,
  handleSubmit,
  categories,
  addCategory,
}: ExpenseModalProps) {
  const [amountInput, setAmountInput] = useState<string>(expenseForm.amount ? String(expenseForm.amount) : '');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  useEffect(() => {
    setAmountInput(expenseForm.amount ? String(expenseForm.amount) : '');
  }, [expenseForm.amount]);

  if (!isOpen) {
    return null;
  }
  return (
    <>
      <Modal title={isEditing ? 'Edit Expense' : 'Add Expense'} onClose={closeModal} onSubmit={handleSubmit} submitLabel={isEditing ? 'Update' : 'Add'}>
        <div className="space-y-4">
        <label className="block text-sm font-medium text-slate-700">
          Title
          <input
            value={expenseForm.title}
            onChange={e => setExpenseForm(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Expense title"
            className="mt-2 block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
            required
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700 min-w-0">
            Category
            <select
              value={expenseForm.category}
              onChange={e => {
                if (e.target.value === '__add_new__') {
                  setShowNewCategory(true);
                  setNewCategory('');
                } else {
                  setExpenseForm(prev => ({ ...prev, category: e.target.value }));
                }
              }}
              className="mt-2 block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
              required
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              <option value="__add_new__">+ Add new category...</option>
            </select>
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Amount
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={amountInput}
              onChange={e => {
                const raw = e.target.value.replace(/[^0-9.]/g, '');
                setAmountInput(raw);
                setExpenseForm(prev => ({ ...prev, amount: raw === '' ? 0 : Number(raw) }));
              }}
              className="mt-2 block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
              required
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700 min-w-0">
            Date
            <input
              type="date"
              value={expenseForm.date}
              onChange={e => setExpenseForm(prev => ({ ...prev, date: e.target.value }))}
              className="mt-2 block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
              required
            />
          </label>

          <label className="block text-sm font-medium text-slate-700 min-w-0">
            Payment method
            <select
              value={expenseForm.paymentMethod}
              onChange={e => setExpenseForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
              className="mt-2 block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
            >
              <option value="Cash">Cash</option>
              <option value="Bank">Bank</option>
              <option value="M-Pesa">M-Pesa</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debt">Debt</option>
            </select>
          </label>
        </div>

        <label className="block text-sm font-medium text-slate-700">
          Notes
          <textarea
            value={expenseForm.notes ?? ''}
            onChange={e => setExpenseForm(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Optional details"
            rows={4}
            className="mt-2 block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all resize-y"
          />
        </label>
      
        </div>
      </Modal>

      {showNewCategory && (
        <Modal
          title="Add New Category"
          onClose={() => setShowNewCategory(false)}
          onSubmit={e => {
            e.preventDefault();
            const v = newCategory.trim();
            if (!v) return;
            setIsAddingCategory(true);
            try {
              addCategory(v);
              setExpenseForm(prev => ({ ...prev, category: v }));
              setNewCategory('');
              setShowNewCategory(false);
            } finally {
              setIsAddingCategory(false);
            }
          }}
          submitLabel="Save"
          isSubmitting={isAddingCategory}
        >
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Category name
              <input
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                placeholder="e.g., Utilities"
                className="mt-2 block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
                required
              />
            </label>
          </div>
        </Modal>
      )}
    </>
  );
}
