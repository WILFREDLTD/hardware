import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';

interface Props {
  pendingNewUnit: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onPendingChange: (value: string) => void;
  isSubmitting?: boolean;
}

export function UnitModal({ pendingNewUnit, onClose, onSubmit, onPendingChange, isSubmitting }: Props) {
  const isValid = pendingNewUnit.trim().length > 0;
  return (
    <Modal
      title="Add New Base Unit"
      onClose={onClose}
      onSubmit={onSubmit}
      submitDisabled={isSubmitting || !isValid}
      isSubmitting={isSubmitting}
    >
      <div className="space-y-4">
        <Input label="Unit Name" placeholder="e.g., kg, liter, meter, pcs" required value={pendingNewUnit} onChange={(e) => onPendingChange(e.target.value)} autoFocus />
      </div>
    </Modal>
  );
}
