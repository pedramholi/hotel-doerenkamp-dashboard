'use client';

import {
  Wallet,
  PieChart,
  Truck,
  Receipt,
  MoreVertical,
  Euro,
  Bed,
  Users,
  Calendar,
} from 'lucide-react';

interface StatCardProps {
  icon: string;
  value: string;
  label: string;
  hasOverflowMenu?: boolean;
  trend?: string;
}

const iconMap = {
  wallet: Wallet,
  pie: PieChart,
  truck: Truck,
  receipt: Receipt,
  euro: Euro,
  bed: Bed,
  users: Users,
  calendar: Calendar,
};

export function StatCards({ stats }: { stats: StatCardProps[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 xl:gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  hasOverflowMenu,
  trend,
}: StatCardProps) {
  const Icon = iconMap[icon as keyof typeof iconMap];

  return (
    <div className="relative bg-white/55 dark:bg-gray-900/55 backdrop-blur-sm border border-white/55 dark:border-white/8 rounded-3xl p-4 xl:p-5 shadow-lg dark:shadow-2xl min-h-24 flex flex-col justify-between hover:-translate-y-0.5 transition-transform">
      {/* Icon and Menu */}
      <div className="flex items-start justify-between mb-3">
        {Icon && (
          <div className="w-6 h-6 text-gray-900/85 dark:text-gray-50/85">
            <Icon className="w-full h-full stroke-[2]" />
          </div>
        )}
        {hasOverflowMenu && (
          <button className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white/15 dark:hover:bg-white/4 transition-colors">
            <MoreVertical className="w-4 h-4 text-gray-900/65 dark:text-gray-50/65" />
          </button>
        )}
      </div>

      {/* Value */}
      <div className="text-2xl xl:text-3xl font-bold text-gray-900 dark:text-gray-50 mb-1">
        {value}
      </div>

      {/* Label and Trend */}
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm text-gray-900/52 dark:text-gray-50/55 line-clamp-2 flex-1">
          {label}
        </div>
        {trend && (
          <span
            className={`text-xs font-semibold ${
              trend.startsWith('+')
                ? 'text-green-600 dark:text-green-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
