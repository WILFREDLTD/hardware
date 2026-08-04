'use client';

import { Section } from '../Section';

interface ExpenseFiltersProps {
  categories: string[];
  paymentMethods: string[];
  filterCategory: string;
  filterPayment: string;
  searchQuery: string;
  setFilterCategory: (value: string) => void;
  setFilterPayment: (value: string) => void;
  setSearchQuery: (value: string) => void;
  openNewExpense: () => void;
  exportExpensesCSV: () => void;
}

export function ExpenseFilters({
  categories,
  paymentMethods,
  filterCategory,
  filterPayment,
  searchQuery,
  setFilterCategory,
  setFilterPayment,
  setSearchQuery,
  openNewExpense,
  exportExpensesCSV,
}: ExpenseFiltersProps) {
  return (
    <Section
      title="Filters & actions"
      action={(
        <div className="flex flex-wrap gap-2 items-center">
          <button
            type="button"
            onClick={openNewExpense}
            className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition"
          >
            Add expense
          </button>
          <button
            type="button"
            onClick={exportExpensesCSV}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Export CSV
          </button>
        </div>
      )}
    >
      <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          <label className="block text-sm font-medium text-slate-700">
            Search
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search title or category"
              className="mt-2 block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Category
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="mt-2 block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All categories' : category}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Payment method
            <select
              value={filterPayment}
              onChange={e => setFilterPayment(e.target.value)}
              className="mt-2 block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              {paymentMethods.map(method => (
                <option key={method} value={method}>
                  {method === 'all' ? 'All methods' : method}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </Section>
  );
}
