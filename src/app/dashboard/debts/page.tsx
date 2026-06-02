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

export default function DebtsPage() {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);
  const [formData, setFormData] = useState({
    debtorName: '',
    debtorPhone: '',
    amount: 0,
  });
  const [paymentAmount, setPaymentAmount] = useState('');

  useEffect(() => {
    fetchDebts();
  }, []);

  const fetchDebts = async () => {
    try {
      const response = await fetch('/api/debts');
      const data = await response.json();
      setDebts(data);
    } catch (error) {
      console.error('Failed to fetch debts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDebt = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/debts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount as any),
        }),
      });

      if (response.ok) {
        fetchDebts();
        setShowModal(false);
        setFormData({ debtorName: '', debtorPhone: '', amount: 0 });
      }
    } catch (error) {
      console.error('Failed to add debt:', error);
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDebt) return;

    try {
      const response = await fetch(`/api/debts/${selectedDebt.id}/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(paymentAmount),
        }),
      });

      if (response.ok) {
        fetchDebts();
        setSelectedDebt(null);
        setPaymentAmount('');
      }
    } catch (error) {
      console.error('Failed to record payment:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'success';
      case 'PARTIAL':
        return 'warning';
      default:
        return 'danger';
    }
  };

  const totalDebts = debts.reduce((sum, d) => sum + d.amount, 0);
  const totalPaid = debts.reduce((sum, d) => sum + d.amountPaid, 0);
  const totalPending = totalDebts - totalPaid;

  return (
    <div>
      <Header
        title="Debt Management"
        subtitle="Track and manage customer debts"
        action={
          <Button onClick={() => setShowModal(true)}>+ Add Debt</Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <h3 className="text-gray-600 text-sm font-medium mb-2">Total Debts</h3>
          <p className="text-3xl font-bold text-danger-600">
            ${totalDebts.toFixed(2)}
          </p>
        </Card>
        <Card>
          <h3 className="text-gray-600 text-sm font-medium mb-2">Collected</h3>
          <p className="text-3xl font-bold text-green-600">
            ${totalPaid.toFixed(2)}
          </p>
        </Card>
        <Card>
          <h3 className="text-gray-600 text-sm font-medium mb-2">Pending</h3>
          <p className="text-3xl font-bold text-orange-600">
            ${totalPending.toFixed(2)}
          </p>
        </Card>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading debts...</p>
        </div>
      ) : debts.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No debts recorded</p>
            <Button onClick={() => setShowModal(true)}>Add First Debt</Button>
          </div>
        </Card>
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Debtor
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Phone
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Amount
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Paid
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {debts.map((debt) => (
                <tr
                  key={debt.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-4">
                    <p className="font-medium text-gray-900">
                      {debt.debtorName}
                    </p>
                  </td>
                  <td className="py-4 px-4 text-gray-700">{debt.debtorPhone}</td>
                  <td className="py-4 px-4 font-semibold text-gray-900">
                    ${debt.amount.toFixed(2)}
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-green-600 font-semibold">
                      ${debt.amountPaid.toFixed(2)}
                    </span>
                    <span className="text-gray-500 text-sm ml-1">
                      ({((debt.amountPaid / debt.amount) * 100).toFixed(0)}%)
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant={getStatusColor(debt.status) as any}>
                      {debt.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    {debt.status !== 'PAID' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setSelectedDebt(debt);
                          setPaymentAmount('');
                        }}
                      >
                        Record Payment
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {showModal && (
        <Modal
          title="Add New Debt"
          onClose={() => setShowModal(false)}
          onSubmit={handleAddDebt}
        >
          <div className="space-y-4">
            <Input
              label="Debtor Name"
              required
              value={formData.debtorName}
              onChange={(e) =>
                setFormData({ ...formData, debtorName: e.target.value })
              }
            />
            <Input
              label="Phone Number"
              required
              value={formData.debtorPhone}
              onChange={(e) =>
                setFormData({ ...formData, debtorPhone: e.target.value })
              }
            />
            <Input
              label="Amount"
              type="number"
              step="0.01"
              required
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value as any })
              }
            />
          </div>
        </Modal>
      )}

      {selectedDebt && (
        <Modal
          title={`Record Payment - ${selectedDebt.debtorName}`}
          onClose={() => setSelectedDebt(null)}
          onSubmit={handleRecordPayment}
        >
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Debt</p>
              <p className="text-2xl font-bold text-blue-600">
                ${selectedDebt.amount.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Remaining: $
                {(selectedDebt.amount - selectedDebt.amountPaid).toFixed(2)}
              </p>
            </div>
            <Input
              label="Payment Amount"
              type="number"
              step="0.01"
              required
              max={selectedDebt.amount - selectedDebt.amountPaid}
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
