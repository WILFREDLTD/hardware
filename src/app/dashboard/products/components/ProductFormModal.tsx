import React from 'react';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';

interface FormData {
  id: string;
  name: string;
  category: string;
  nickname: string;
  baseUnit: string;
  packageUnitLabel: string;
  packageSize: number;
  supplierName: string;
  supplierNumber: string;
}

interface Props {
  isEditing: boolean;
  isSaving: boolean;
  formData: FormData;
  categories: string[];
  baseUnits: string[];
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: keyof FormData, value: string | number) => void;
  onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBaseUnitChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function ProductFormModal({ isEditing, isSaving, formData, categories, baseUnits, onClose, onSubmit, onChange, onCategoryChange, onBaseUnitChange }: Props) {
  return (
    <Modal title={isEditing ? 'Edit Product' : 'Add Product'} onClose={onClose} onSubmit={onSubmit} submitDisabled={isSaving} submitLabel={isSaving ? 'Saving...' : undefined}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Product Name" required value={formData.name} onChange={(e) => onChange('name', e.target.value)} />
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1.5">Category <span className="text-red-500">*</span></label>
            <select required value={formData.category} onChange={onCategoryChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all">
              <option value="">Select a category</option>
              {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              <option value="NEW_CATEGORY" className="font-semibold text-blue-600">+ New Category</option>
            </select>
          </div>
        </div>

        <Input label="Nickname" placeholder="Optional short name" value={formData.nickname} onChange={(e) => onChange('nickname', e.target.value)} />

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1.5">Base Unit</label>
            <select value={formData.baseUnit} onChange={onBaseUnitChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all">
              {baseUnits.map((unit) => <option key={unit} value={unit}>{unit}</option>)}
              <option value="NEW_UNIT" className="font-semibold text-blue-600">+ New Unit</option>
            </select>
          </div>
          <Input label="Package Unit" placeholder="bag, box, bundle" value={formData.packageUnitLabel} onChange={(e) => onChange('packageUnitLabel', e.target.value)} />
          <Input label="Package Size" type="number" min="0" value={formData.packageSize} onChange={(e) => onChange('packageSize', parseInt(e.target.value || '0', 10))} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Supplier Name" placeholder="unknown" value={formData.supplierName} onChange={(e) => onChange('supplierName', e.target.value)} />
          <Input
            label="Supplier Number"
            placeholder="10 or 12 digits"
            value={formData.supplierNumber}
            onChange={(e) => onChange('supplierNumber', e.target.value)}
            inputMode="numeric"
            pattern="^(?:\d{10}|\d{12})$"
            maxLength={12}
          />
        </div>
      </div>
    </Modal>
  );
}
