import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { formatKES } from '@/lib/utils';
import type { Debt } from './types';

interface AddDebtModalProps {
  open: boolean;
  formData: { debtorName: string; debtorPhone: string; amount: number | string };
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onFieldChange: (field: 'debtorName' | 'debtorPhone' | 'amount', value: string | number) => void;
}

export function AddDebtModal({ open, formData, onClose, onSubmit, onFieldChange }: AddDebtModalProps) {
  if (!open) return null;

  return (
    <Modal title="Add New Debt" onClose={onClose} onSubmit={onSubmit}>
      <div className="space-y-4">
        <Input label="Debtor Name" required value={formData.debtorName} onChange={(e) => onFieldChange('debtorName', e.target.value)} />
        <Input label="Phone Number" required value={formData.debtorPhone} onChange={(e) => onFieldChange('debtorPhone', e.target.value)} />
        <Input label="Amount (KES)" type="number" step="0.01" required value={formData.amount} onChange={(e) => onFieldChange('amount', e.target.value)} />
      </div>
    </Modal>
  );
}

interface PaymentModalProps {
  debt: Debt | null;
  paymentAmount: string;
  paymentMethod: 'CASH' | 'MPESA';
  mpesaNumber: string;
  mpesaStatus: string | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onPaymentAmountChange: (value: string) => void;
  onPaymentMethodChange: (value: 'CASH' | 'MPESA') => void;
  onMpesaNumberChange: (value: string) => void;
}

export function PaymentModal({ debt, paymentAmount, paymentMethod, mpesaNumber, mpesaStatus, onClose, onSubmit, onPaymentAmountChange, onPaymentMethodChange, onMpesaNumberChange }: PaymentModalProps) {
  if (!debt) return null;

  return (
    <Modal title={`Record Payment — ${debt.debtorName}`} onClose={onClose} onSubmit={onSubmit}>
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">Total Debt</span>
            <span className="text-lg font-bold text-gray-900">KES {formatKES(debt.amount)}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
            <div className="h-full rounded-full" style={{ width: `${(debt.amountPaid / debt.amount) * 100}%`, backgroundColor: '#1a6b45' }} />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-green-600 font-medium">Paid: KES {formatKES(debt.amountPaid)}</span>
            <span className="text-red-500 font-medium">Remaining: KES {formatKES(debt.amount - debt.amountPaid)}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">Payment Method</div>
            <div className="grid grid-cols-2 gap-2">
              {(['CASH', 'MPESA'] as const).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => onPaymentMethodChange(method)}
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${paymentMethod === method ? 'border-green-600 bg-green-600 text-white' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {paymentMethod === 'MPESA' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">M-Pesa mobile number</label>
              <input
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30"
                type="tel"
                placeholder="07XXXXXXXX"
                value={mpesaNumber}
                onChange={(e) => onMpesaNumberChange(e.target.value)}
              />
              {mpesaStatus && <p className="text-xs text-gray-500">{mpesaStatus}</p>}
            </div>
          )}

          <Input label="Payment Amount (KES)" type="number" step="0.01" required value={paymentAmount} onChange={(e) => onPaymentAmountChange(e.target.value)} />
        </div>
      </div>
    </Modal>
  );
}
