import type { Product } from './types';

interface Props {
  products: Product[];
  categories: string[];
  packagedCount: number;
  uniqueBaseUnits: number;
}

export function ProductStats({ products, categories, packagedCount, uniqueBaseUnits }: Props) {
  const cards = [
    { label: 'Products', value: products.length, icon: '📦', color: 'text-gray-900' },
    { label: 'Categories', value: categories.length, icon: '🗂️', color: 'text-emerald-700' },
    { label: 'Base Units', value: uniqueBaseUnits, icon: '📏', color: 'text-blue-700' },
    { label: 'Packaged Products', value: packagedCount, icon: '🧾', color: 'text-indigo-700' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="bg-white rounded-xl border border-gray-100 px-4 py-3">
          <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">{card.label}</div>
          <div className={`text-xl font-semibold ${card.color}`}>{card.icon} {card.value}</div>
        </div>
      ))}
    </div>
  );
}
