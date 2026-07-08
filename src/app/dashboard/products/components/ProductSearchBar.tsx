interface Props {
  search: string;
  onSearchChange: (value: string) => void;
}

export function ProductSearchBar({ search, onSearchChange }: Props) {
  return (
    <div className="relative">
      <input
        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
        placeholder="Search by name, nickname, or category…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">🔍</div>
    </div>
  );
}
