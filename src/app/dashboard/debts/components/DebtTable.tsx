import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatKES } from '@/lib/utils';
import type { Debt } from './types';

interface Props {
  loading: boolean;
  debts: Debt[];
  filteredDebts: Debt[];
  onRecordPayment: (debt: Debt) => void;
  onAddFirstDebt: () => void;
}

function InitialsAvatar({ name }: { name: string }) {
  const initials = name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
  const colors = ['#1a6b45', '#2563eb', '#7c3aed', '#db2777', '#b45309'];
  const color = colors[name.charCodeAt(0) % colors.length];

  return (
    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: color }}>
      {initials}
    </div>
  );
}

function ProgressRing({ pct }: { pct: number }) {
  const r = 16;
  const c = 2 * Math.PI * r;
  const fill = c - (pct / 100) * c;
  const color = pct >= 100 ? '#1a6b45' : pct >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <svg width="40" height="40" viewBox="0 0 40 40" className="flex-shrink-0">
      <circle cx="20" cy="20" r={r} fill="none" stroke="#f3f4f6" strokeWidth="3" />
      <circle cx="20" cy="20" r={r} fill="none" stroke={color} strokeWidth="3" strokeDasharray={`${c}`} strokeDashoffset={fill} strokeLinecap="round" transform="rotate(-90 20 20)" style={{ transition: 'stroke-dashoffset 0.5s' }} />
      <text x="20" y="24" textAnchor="middle" fontSize="9" fontWeight="600" fill={color}>{Math.round(pct)}%</text>
    </svg>
  );
}

export function DebtTable({ loading, debts, filteredDebts, onRecordPayment, onAddFirstDebt }: Props) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-green-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (filteredDebts.length === 0) {
    return (
      <Card>
        <div className="text-center py-16">
          <div className="text-5xl mb-4">💳</div>
          <p className="text-gray-500 mb-4">{debts.length === 0 ? 'No debts recorded yet' : 'No debts match your filters'}</p>
          {debts.length === 0 && <Button onClick={onAddFirstDebt}>Add First Debt</Button>}
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-x-auto p-0">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-3.5 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Debtor</th>
            <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Contact</th>
            <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Progress</th>
            <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
            <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
            <th className="py-3.5 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider" />
          </tr>
        </thead>
        <tbody>
          {filteredDebts.map((debt) => (
            <tr key={debt.id} className="border-b border-gray-50 hover:bg-gray-50/70 transition-colors">
              <td className="py-4 px-5">
                <div className="flex items-center gap-3">
                  <InitialsAvatar name={debt.debtorName} />
                  <div className="text-sm font-semibold text-gray-900">{debt.debtorName}</div>
                </div>
              </td>
              <td className="py-4 px-4">
                <a href={`tel:${debt.debtorPhone}`} className="text-sm text-blue-600 hover:underline">{debt.debtorPhone}</a>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <ProgressRing pct={(debt.amountPaid / debt.amount) * 100} />
                  <div>
                    <div className="text-xs font-medium text-gray-700">KES {formatKES(debt.amountPaid)}</div>
                    <div className="text-xs text-gray-400">of KES {formatKES(debt.amount)}</div>
                  </div>
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="text-sm font-bold text-gray-900">KES {formatKES(debt.amount)}</div>
                {debt.status !== 'PAID' && <div className="text-xs text-red-500">KES {formatKES(debt.amount - debt.amountPaid)} remaining</div>}
              </td>
              <td className="py-4 px-4">
                <Badge variant={debt.status === 'PAID' ? 'success' : debt.status === 'PARTIAL' ? 'warning' : 'danger'}>{debt.status}</Badge>
              </td>
              <td className="py-4 px-4">
                {debt.status !== 'PAID' && (
                  <button
                    onClick={() => onRecordPayment(debt)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors hover:text-white"
                    style={{ borderColor: '#1a6b45', color: '#1a6b45' }}
                    onMouseEnter={(e) => { (e.target as HTMLElement).style.backgroundColor = '#1a6b45'; (e.target as HTMLElement).style.color = '#fff'; }}
                    onMouseLeave={(e) => { (e.target as HTMLElement).style.backgroundColor = 'transparent'; (e.target as HTMLElement).style.color = '#1a6b45'; }}
                  >
                    Record Payment
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
