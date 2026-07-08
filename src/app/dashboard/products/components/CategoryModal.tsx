import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';

interface Props {
  pendingNewCategory: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onPendingChange: (value: string) => void;
}

export function CategoryModal({ pendingNewCategory, onClose, onSubmit, onPendingChange }: Props) {
  return (
    <Modal title="Add New Category" onClose={onClose} onSubmit={onSubmit}>
      <div className="space-y-4">
        <Input label="Category Name" placeholder="e.g., Fasteners, Lighting, Plumbing Tools" required value={pendingNewCategory} onChange={(e) => onPendingChange(e.target.value)} autoFocus />
      </div>
    </Modal>
  );
}
