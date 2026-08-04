'use client';

import { useMemo, useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { ExpenseFilters } from './ExpenseFilters';
import { ExpenseModal } from './ExpenseModal';
import { ExpenseOverview } from './ExpenseOverview';
import { ExpenseTransactions } from './ExpenseTransactions';
import type { Expense } from './types';

interface ExpensesSectionProps {
  expenses: Expense[];
  onAddExpense: (expense: Expense) => void;
  onUpdateExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
}

interface ExpenseForm {
  id: string;
  date: string;
  category: string;
  title: string;
  amount: number;
  paymentMethod: string;
  notes?: string;
}

const DEFAULT_EXPENSE_FORM: ExpenseForm = {
  id: '',
  date: new Date().toISOString().slice(0, 10),
  category: 'Rent',
  title: '',
  amount: 0,
  paymentMethod: 'Cash',
  notes: '',
};

export function ExpensesSection({ expenses, onAddExpense, onUpdateExpense, onDeleteExpense }: ExpensesSectionProps) {
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [expenseForm, setExpenseForm] = useState<ExpenseForm>(DEFAULT_EXPENSE_FORM);

  const derivedCategories = useMemo(() => Array.from(new Set(expenses.map(expense => expense.category))).sort(), [expenses]);
  const [categories, setCategories] = useState<string[]>(derivedCategories);

  useEffect(() => {
    setCategories(prev => {
      const merged = Array.from(new Set([...prev, ...derivedCategories])).sort();
      return merged;
    });
  }, [derivedCategories]);

  const paymentMethods = useMemo(() => ['all', ...Array.from(new Set(expenses.map(expense => expense.paymentMethod))).sort()], [expenses]);

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter(expense => filterCategory === 'all' || expense.category === filterCategory)
      .filter(expense => filterPayment === 'all' || expense.paymentMethod === filterPayment)
      .filter(expense => expense.title.toLowerCase().includes(searchQuery.toLowerCase()) || expense.category.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, filterCategory, filterPayment, searchQuery]);

  const paymentSummary = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach(expense => {
      map[expense.paymentMethod] = (map[expense.paymentMethod] || 0) + expense.amount;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [expenses]);

  const categorySummary = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach(expense => {
      map[expense.category] = (map[expense.category] || 0) + expense.amount;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [expenses]);

  function openNewExpense() {
    setIsEditing(false);
    setExpenseForm(DEFAULT_EXPENSE_FORM);
    setIsModalOpen(true);
  }

  function openEditExpense(expense: Expense) {
    setIsEditing(true);
    setExpenseForm({ ...expense });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setExpenseForm(DEFAULT_EXPENSE_FORM);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload: Expense = {
      id: isEditing && expenseForm.id ? expenseForm.id : crypto.randomUUID(),
      date: expenseForm.date,
      category: expenseForm.category,
      title: expenseForm.title,
      amount: Number(expenseForm.amount),
      paymentMethod: expenseForm.paymentMethod,
      notes: expenseForm.notes,
    };

    if (isEditing) {
      onUpdateExpense(payload);
    } else {
      onAddExpense(payload);
    }

    closeModal();
  }

  function exportExpensesCSV() {
    const rows = [['Date', 'Category', 'Title', 'Amount (KES)', 'Payment Method', 'Notes']];
    expenses.forEach(expense => rows.push([
      new Date(expense.date).toLocaleDateString(),
      expense.category,
      expense.title,
      expense.amount.toFixed(2),
      expense.paymentMethod,
      expense.notes || '',
    ]));
    const content = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([content], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'expenses-report.csv'; a.click();
  }

  return (
    <div className="space-y-6">
      <Header
        title="Expenses"
        subtitle="Track your business expenses and generate reports."
        action={<Button onClick={openNewExpense}>+ Add Expense</Button>}
      />
      <div className="grid grid-cols-1 gap-6">
        <ExpenseOverview categorySummary={categorySummary} paymentSummary={paymentSummary} />
        <ExpenseFilters
          categories={['all', ...categories]}
          paymentMethods={paymentMethods}
          filterCategory={filterCategory}
          filterPayment={filterPayment}
          searchQuery={searchQuery}
          setFilterCategory={setFilterCategory}
          setFilterPayment={setFilterPayment}
          setSearchQuery={setSearchQuery}
          openNewExpense={openNewExpense}
          exportExpensesCSV={exportExpensesCSV}
        />
      </div>

      <ExpenseTransactions
        filteredExpenses={filteredExpenses}
        openEditExpense={openEditExpense}
        onDeleteExpense={onDeleteExpense}
      />

      <ExpenseModal
        isOpen={isModalOpen}
        isEditing={isEditing}
        expenseForm={expenseForm}
        setExpenseForm={setExpenseForm}
        closeModal={closeModal}
        handleSubmit={handleSubmit}
        categories={categories}
        addCategory={(c: string) => setCategories(prev => prev.includes(c) ? prev : [...prev, c].sort())}
      />
    </div>
  );
}
