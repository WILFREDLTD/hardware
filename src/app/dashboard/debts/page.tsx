'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';

interface Debt {
  id: string;
  debtorName: string;
  debtorPhone: string;
  amount: number;
  amountPaid: number;
  status: 'PENDING' | 'PARTIAL' | 'PAID';
  date: string;
  dueDate?: string;
}

function InitialsAvatar({ name }: { name: string }) {
  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  const colors = ['#1a6b45', '#2563eb', '#7c3aed', '#db2777', '#b45309'];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: color }}>
      {initials}
    </div>
  );
}

function ProgressRing({ pct }: { pct: number }) {
  const r = 16, c = 2 * Math.PI * r;
  const fill = c - (pct / 100) * c;
  const color = pct >= 100 ? '#1a6b45' : pct >= 50 ? '#f59e0b' : '#ef4444';
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" className="flex-shrink-0">
      <circle cx="20" cy="20" r={r} fill="none" stroke="#f3f4f6" strokeWidth="3" />
      <circle cx="20" cy="20" r={r} fill="none" stroke={color} strokeWidth="3"
        strokeDasharray={`${c}`} strokeDashoffset={fill}
        strokeLinecap="round" transform="rotate(-90 20 20)" style={{ transition: 'stroke-dashoffset 0.5s' }} />
      <text x="20" y="24" textAnchor="middle" fontSize="9" fontWeight="600" fill={color}>{Math.round(pct)}%</text>
    </svg>
  );
}

export default function DebtsPage() {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'PENDING' | 'PARTIAL' | 'PAID'>('all');
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ debtorName: '', debtorPhone: '', amount: 0 });
  const [paymentAmount, setPaymentAmount] = useState('');

  useEffect(() => { fetchDebts(); }, []);

  const fetchDebts = async () => {
    try {
      setDebts(await (await fetch('/api/debts')).json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleAddDebt = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/debts', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, amount: parseFloat(formData.amount as any) }),
      });
      if (res.ok) { fetchDebts(); setShowModal(false); setFormData({ debtorName: '', debtorPhone: '', amount: 0 }); }
    } catch (e) { console.error(e); }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDebt) return;
    try {
      const res = await fetch(`/api/debts/${selectedDebt.id}/payment`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(paymentAmount) }),
      });
      if (res.ok) { fetchDebts(); setSelectedDebt(null); setPaymentAmount(''); }
    } catch (e) { console.error(e); }
  };

  const statusVariant = (s: string) => s === 'PAID' ? 'success' : s === 'PARTIAL' ? 'warning' : 'danger';

  const totalDebts = debts.reduce((s, d) => s + d.amount, 0);
  const totalPaid = debts.reduce((s, d) => s + d.amountPaid, 0);
  const totalPending = totalDebts - totalPaid;
  const collectionRate = totalDebts > 0 ? (totalPaid / totalDebts) * 100 : 0;

  const filtered = debts
    .filter(d => filterStatus === 'all' || d.status === filterStatus)
    .filter(d => !search || d.debtorName.toLowerCase().includes(search.toLowerCase()) || d.debtorPhone.includes(search));

  return (
    <div className="space-y-6">
      <Header
        title="Debt Management"
        subtitle="Track and manage customer debts"
        action={<Button onClick={() => setShowModal(true)}>+ Add Debt</Button>}
      />

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Owed', value: `KES ${totalDebts.toFixed(2)}`, sub: `${debts.length} debtors`, icon: '💳', color: 'text-red-500' },
          { label: 'Collected', value: `KES ${totalPaid.toFixed(2)}`, sub: `${collectionRate.toFixed(0)}% rate`, icon: '✅', color: 'text-green-700' },
          { label: 'Pending', value: `KES ${totalPending.toFixed(2)}`, sub: `${debts.filter(d => d.status !== 'PAID').length} outstanding`, icon: '⏳', color: 'text-amber-600' },
          { label: 'Fully Paid', value: debts.filter(d => d.status === 'PAID').length, sub: 'accounts cleared', icon: '🎉', color: 'text-gray-900' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 px-4 py-3">
            <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">{s.label}</div>
            <div className={`text-xl font-semibold ${s.color}`}>{s.icon} {s.value}</div>
            <div className="text-xs text-gray-400 mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Collection progress bar */}
      <div className="bg-white rounded-xl border border-gray-100 px-5 py-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Collection Progress</span>
          <span className="text-sm font-bold" style={{ color: '#1a6b45' }}>{collectionRate.toFixed(1)}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${collectionRate}%`, backgroundColor: '#1a6b45' }} />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>KES 0</span>
          <span>KES {totalDebts.toFixed(2)}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-52">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 6.75 6.75a7.5 7.5 0 0 0 10.6 10.6z" /></svg>
          </div>
          <input
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
            value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or phone…"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'PENDING', 'PARTIAL', 'PAID'] as const).map(f => (
            <button key={f} onClick={() => setFilterStatus(f)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${filterStatus === f ? 'text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'}`}
              style={filterStatus === f ? { backgroundColor: '#1a6b45' } : {}}>
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-green-600 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <div className="text-center py-16">
            <div className="text-5xl mb-4">💳</div>
            <p className="text-gray-500 mb-4">{debts.length === 0 ? 'No debts recorded yet' : 'No debts match your filters'}</p>
            {debts.length === 0 && <Button onClick={() => setShowModal(true)}>Add First Debt</Button>}
          </div>
        </Card>
      ) : (
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
              {filtered.map(debt => (
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
                        <div className="text-xs font-medium text-gray-700">KES {debt.amountPaid.toFixed(2)}</div>
                        <div className="text-xs text-gray-400">of KES {debt.amount.toFixed(2)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm font-bold text-gray-900">KES {debt.amount.toFixed(2)}</div>
                    {debt.status !== 'PAID' && (
                      <div className="text-xs text-red-500">KES {(debt.amount - debt.amountPaid).toFixed(2)} remaining</div>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant={statusVariant(debt.status) as any}>{debt.status}</Badge>
                  </td>
                  <td className="py-4 px-4">
                    {debt.status !== 'PAID' && (
                      <button
                        onClick={() => { setSelectedDebt(debt); setPaymentAmount(''); }}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors hover:text-white"
                        style={{ borderColor: '#1a6b45', color: '#1a6b45' }}
                        onMouseEnter={e => { (e.target as HTMLElement).style.backgroundColor = '#1a6b45'; (e.target as HTMLElement).style.color = '#fff'; }}
                        onMouseLeave={e => { (e.target as HTMLElement).style.backgroundColor = 'transparent'; (e.target as HTMLElement).style.color = '#1a6b45'; }}
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
      )}

      {/* Add Debt Modal */}
      {showModal && (
        <Modal title="Add New Debt" onClose={() => setShowModal(false)} onSubmit={handleAddDebt}>
          <div className="space-y-4">
            <Input label="Debtor Name" required value={formData.debtorName} onChange={e => setFormData({ ...formData, debtorName: e.target.value })} />
            <Input label="Phone Number" required value={formData.debtorPhone} onChange={e => setFormData({ ...formData, debtorPhone: e.target.value })} />
            <Input label="Amount (KES)" type="number" step="0.01" required value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value as any })} />
          </div>
        </Modal>
      )}

      {/* Payment Modal */}
      {selectedDebt && (
        <Modal title={`Record Payment — ${selectedDebt.debtorName}`} onClose={() => setSelectedDebt(null)} onSubmit={handleRecordPayment}>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">Total Debt</span>
                <span className="text-lg font-bold text-gray-900">KES {selectedDebt.amount.toFixed(2)}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
                <div className="h-full rounded-full" style={{ width: `${(selectedDebt.amountPaid / selectedDebt.amount) * 100}%`, backgroundColor: '#1a6b45' }} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-600 font-medium">Paid: KES {selectedDebt.amountPaid.toFixed(2)}</span>
                <span className="text-red-500 font-medium">Remaining: KES {(selectedDebt.amount - selectedDebt.amountPaid).toFixed(2)}</span>
              </div>
            </div>
            <Input
              label="Payment Amount (KES)"
              type="number"
              step="0.01"
              required
              max={selectedDebt.amount - selectedDebt.amountPaid}
              value={paymentAmount}
              onChange={e => setPaymentAmount(e.target.value)}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}