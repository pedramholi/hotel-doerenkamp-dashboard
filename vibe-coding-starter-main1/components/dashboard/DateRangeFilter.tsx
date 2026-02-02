'use client';

import { Calendar } from 'lucide-react';
import { useState } from 'react';

export type DateRange = '7' | '30' | '90' | 'all';

interface DateRangeFilterProps {
  selectedRange: DateRange;
  onRangeChange: (range: DateRange) => void;
}

export function DateRangeFilter({ selectedRange, onRangeChange }: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const ranges: { value: DateRange; label: string }[] = [
    { value: '7', label: 'Letzte 7 Tage' },
    { value: '30', label: 'Letzte 30 Tage' },
    { value: '90', label: 'Letzte 90 Tage' },
    { value: 'all', label: 'Gesamt' },
  ];

  const selectedLabel = ranges.find(r => r.value === selectedRange)?.label || 'Gesamt';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/55 dark:bg-gray-900/55 backdrop-blur-sm border border-white/55 dark:border-white/8 rounded-full text-sm font-medium text-gray-900 dark:text-gray-50 hover:bg-white/70 dark:hover:bg-gray-900/70 transition-all shadow-sm"
      >
        <Calendar className="w-4 h-4" />
        {selectedLabel}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-white/55 dark:border-white/8 rounded-2xl shadow-2xl z-20 overflow-hidden">
            {ranges.map((range) => (
              <button
                key={range.value}
                onClick={() => {
                  onRangeChange(range.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                  selectedRange === range.value
                    ? 'bg-primary-500/10 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 font-medium'
                    : 'text-gray-900 dark:text-gray-50 hover:bg-white/50 dark:hover:bg-gray-800/50'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
