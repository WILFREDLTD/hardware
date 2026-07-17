import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';

interface Props {
  pendingNewSupplier: { name: string; phone: string };
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onPendingChange: (field: 'name' | 'phone', value: string) => void;
  isSubmitting?: boolean;
}

export function SupplierModal({ pendingNewSupplier, onClose, onSubmit, onPendingChange, isSubmitting }: Props) {
  const handlePhoneChange = (value: string) => {
    // Remove all non-digit characters
    const digitsOnly = value.replace(/\D/g, '');
    
    // Limit to 12 digits max
    if (digitsOnly.length <= 12) {
      onPendingChange('phone', digitsOnly);
    }
  };

  // Validate form
  const nameValid = pendingNewSupplier.name.trim().length > 0;
  const phoneValid = pendingNewSupplier.phone.length === 10 || pendingNewSupplier.phone.length === 12;
  const isFormValid = nameValid && phoneValid;

  return (
    <Modal
      title="Add New Supplier"
      onClose={onClose}
      onSubmit={onSubmit}
      submitDisabled={isSubmitting || !isFormValid}
      isSubmitting={isSubmitting}
    >
      <div className="space-y-4">
        <Input
          label="Supplier Name"
          placeholder="e.g., ABC Hardware Suppliers"
          required
          value={pendingNewSupplier.name}
          onChange={(e) => onPendingChange('name', e.target.value)}
          autoFocus
        />
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1.5">Supplier Phone <span className="text-red-500">*</span></label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="10 or 12 digits"
            value={pendingNewSupplier.phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            maxLength={12}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
          />
          <span className={`text-xs mt-1 ${
            pendingNewSupplier.phone.length === 0
              ? 'text-gray-500'
              : phoneValid
              ? 'text-green-600'
              : 'text-red-600'
          }`}>
            {pendingNewSupplier.phone.length === 0
              ? 'Required - 10 or 12 digits'
              : phoneValid
              ? `${pendingNewSupplier.phone.length} digits ✓`
              : `${pendingNewSupplier.phone.length} digits (must be 10 or 12)`}
          </span>
        </div>
      </div>
    </Modal>
  );
}
