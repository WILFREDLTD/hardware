import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';

interface Props {
  pendingNewUnit: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onPendingChange: (value: string) => void;
}

export function UnitModal({ pendingNewUnit, onClose, onSubmit, onPendingChange }: Props) {
  return (
    <Modal title="Add New Base Unit" onClose={onClose} onSubmit={onSubmit}>
      <div className="space-y-4">
        <Input label="Unit Name" placeholder="e.g., kg, liter, meter, pcs" required value={pendingNewUnit} onChange={(e) => onPendingChange(e.target.value)} autoFocus />
      </div>
    </Modal>
  );
}
