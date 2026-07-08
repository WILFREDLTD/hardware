import type { DebtFilterStatus } from './types';

interface Props {
  search: string;
  filterStatus: DebtFilterStatus;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: DebtFilterStatus) => void;
}

export function DebtFilters({ search, filterStatus, onSearchChange, onFilterChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-52">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 6.75 6.75a7.5 7.5 0 0 0 10.6 10.6z" /></svg>
        </div>
        <input
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or phone…"
        />
      </div>
      <div className="flex gap-2">
        {(['all', 'PENDING', 'PARTIAL', 'PAID'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${filterStatus === filter ? 'text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'}`}
            style={filterStatus === filter ? { backgroundColor: '#1a6b45' } : {}}
          >
            {filter === 'all' ? 'All' : filter}
          </button>
        ))}
      </div>
    </div>
  );
}
