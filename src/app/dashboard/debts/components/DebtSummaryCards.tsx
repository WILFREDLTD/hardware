import { formatKES } from '@/lib/utils';

interface Props {
  totalDebts: number;
  totalPaid: number;
  totalPending: number;
  debtsCount: number;
  fullyPaidCount: number;
  collectionRate: number;
}

export function DebtSummaryCards({ totalDebts, totalPaid, totalPending, debtsCount, fullyPaidCount, collectionRate }: Props) {
  const cards = [
    { label: 'Total Owed', value: `KES ${formatKES(totalDebts)}`, sub: `${debtsCount} debtors`, icon: '💳', color: 'text-red-500' },
    { label: 'Collected', value: `KES ${formatKES(totalPaid)}`, sub: `${collectionRate.toFixed(0)}% rate`, icon: '✅', color: 'text-green-700' },
    { label: 'Pending', value: `KES ${formatKES(totalPending)}`, sub: `${debtsCount > 0 ? 'outstanding' : 'none'}`, icon: '⏳', color: 'text-amber-600' },
    { label: 'Fully Paid', value: fullyPaidCount, sub: 'accounts cleared', icon: '🎉', color: 'text-gray-900' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="bg-white rounded-xl border border-gray-100 px-4 py-3">
          <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">{card.label}</div>
          <div className={`text-xl font-semibold ${card.color}`}>{card.icon} {card.value}</div>
          <div className="text-xs text-gray-400 mt-1">{card.sub}</div>
        </div>
      ))}
    </div>
  );
}
