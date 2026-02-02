import { Search } from 'lucide-react';

interface BookingsSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
}

export function BookingsSearchBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: BookingsSearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search Input */}
      <div className="flex-1 relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Search className="w-4 h-4 text-gray-900/40 dark:text-gray-50/40" />
        </div>
        <input
          type="text"
          placeholder="Suche nach Gast oder Buchungsnummer..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-10 pl-9 pr-4 rounded-2xl bg-white/55 dark:bg-gray-900/55 backdrop-blur-sm border border-white/55 dark:border-white/8 text-sm text-gray-900 dark:text-gray-50 placeholder:text-gray-900/40 dark:placeholder:text-gray-50/40 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
        />
      </div>

      {/* Status Filter */}
      <div className="sm:w-48">
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="w-full h-10 px-4 rounded-2xl bg-white/55 dark:bg-gray-900/55 backdrop-blur-sm border border-white/55 dark:border-white/8 text-sm text-gray-900 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all appearance-none cursor-pointer"
        >
          <option value="all">Alle Status</option>
          <option value="OK">OK</option>
          <option value="Storniert">Storniert</option>
          <option value="Wartend">Wartend</option>
        </select>
      </div>
    </div>
  );
}
