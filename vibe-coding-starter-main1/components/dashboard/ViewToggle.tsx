'use client';

import { Calendar, BarChart3, TrendingUp } from 'lucide-react';

export type ViewType = 'day' | 'week' | 'month';

interface ViewToggleProps {
  selectedView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function ViewToggle({ selectedView, onViewChange }: ViewToggleProps) {
  const views: { value: ViewType; label: string; icon: typeof Calendar }[] = [
    { value: 'day', label: 'Tag', icon: Calendar },
    { value: 'week', label: 'Woche', icon: BarChart3 },
    { value: 'month', label: 'Monat', icon: TrendingUp },
  ];

  return (
    <div className="inline-flex items-center gap-1 p-1 bg-white/55 dark:bg-gray-900/55 backdrop-blur-sm border border-white/55 dark:border-white/8 rounded-full">
      {views.map((view) => {
        const Icon = view.icon;
        const isActive = selectedView === view.value;

        return (
          <button
            key={view.value}
            onClick={() => onViewChange(view.value)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all
              ${
                isActive
                  ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-gray-50 shadow-sm'
                  : 'text-gray-900/52 dark:text-gray-50/55 hover:text-gray-900/78 dark:hover:text-gray-50/78'
              }
            `}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{view.label}</span>
          </button>
        );
      })}
    </div>
  );
}
