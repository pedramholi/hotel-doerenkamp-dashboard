'use client';

import { Phone, Calendar, Search, Bell, ChevronDown } from 'lucide-react';
import { ThemeSwitch } from '@/components/shared/ThemeSwitch';

const tabs = [
  'Dashboard',
  'Finance',
  'Accounts',
  'HR and Payroll',
  'Peoples',
  'Contracts',
];

export function GlassNav() {
  return (
    <nav className="w-full h-14 rounded-full bg-white/55 dark:bg-gray-900/55 backdrop-blur-sm border border-white/55 dark:border-white/8 shadow-sm px-4 flex items-center justify-between gap-4">
      {/* Logo */}
      <div className="flex-shrink-0">
        <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full border-2 border-white" />
        </div>
      </div>

      {/* Center Tabs - Hidden on mobile, visible on lg+ */}
      <div className="hidden lg:flex items-center gap-1 xl:gap-4 flex-1 justify-center max-w-3xl overflow-x-auto scrollbar-hide">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            className={`
              px-3 xl:px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
              ${
                index === 0
                  ? 'bg-white/90 dark:bg-white/8 text-gray-900 dark:text-gray-50 shadow-sm'
                  : 'text-gray-900/52 dark:text-gray-50/55 hover:text-gray-900/78 dark:hover:text-gray-50/78 hover:bg-white/15 dark:hover:bg-white/4'
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Mobile: Just show Dashboard */}
      <div className="flex lg:hidden flex-1 justify-center">
        <button className="px-4 py-2 rounded-full text-sm font-medium bg-white/90 dark:bg-white/8 text-gray-900 dark:text-gray-50 shadow-sm">
          Dashboard
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 xl:gap-3">
        {/* Icon Buttons - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-2">
          <IconButton icon={Phone} />
          <IconButton icon={Calendar} />
          <IconButton icon={Search} />
          <IconButton icon={Bell} hasBadge />
        </div>

        {/* Theme Switch */}
        <ThemeSwitch />

        {/* Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-gray-900/10 dark:border-white/10">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-medium">
            JD
          </div>
          <ChevronDown className="hidden sm:block w-4 h-4 text-gray-900/65 dark:text-gray-50/65" />
        </div>
      </div>
    </nav>
  );
}

function IconButton({
  icon: Icon,
  hasBadge,
}: {
  icon: React.ComponentType<{ className?: string }>;
  hasBadge?: boolean;
}) {
  return (
    <button className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/15 dark:hover:bg-white/4 transition-colors">
      <Icon className="w-5 h-5 text-gray-900/85 dark:text-gray-50/85 stroke-[2]" />
      {hasBadge && (
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
      )}
    </button>
  );
}
