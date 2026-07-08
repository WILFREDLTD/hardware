interface Props {
  search: string;
  onSearchChange: (value: string) => void;
}

export function InventorySearchBar({ search, onSearchChange }: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-2">Search products</label>
        <input className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all" placeholder="Search by name, nickname, or category" value={search} onChange={(e) => onSearchChange(e.target.value)} />
      </div>
    </div>
  );
}
