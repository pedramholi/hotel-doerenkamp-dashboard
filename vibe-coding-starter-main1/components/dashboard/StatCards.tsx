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
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import { useState } from 'react';
import { StatCardModal } from './StatCardModal';
import { Sparkline } from './Sparkline';

interface StatCardProps {
  icon: string;
  value: string;
  label: string;
  hasOverflowMenu?: boolean;
  trend?: string;
  sparklineData?: number[];
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
        <StatCard key={index} index={index} {...stat} />
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
  sparklineData,
  index,
}: StatCardProps & { index: number }) {
  const Icon = iconMap[icon as keyof typeof iconMap];
  const [showModal, setShowModal] = useState(false);

  // Generate modal details based on the stat type
  const getModalDetails = () => {
    const titles = [
      'Umsatz Details',
      'Buchungen Übersicht',
      'Gäste Statistik',
      'Auslastung Details',
    ];

    const descriptions = [
      'Gesamtumsatz aus allen aktiven Buchungen',
      'Anzahl aller Buchungen im gewählten Zeitraum',
      'Gesamtanzahl der Gäste (Erwachsene + Kinder)',
      'Gebuchte Übernachtungen in Room Nights',
    ];

    const detailsList = [
      [
        { label: 'Brutto-Umsatz', value: value, trend: trend },
        { label: 'Ø Buchungswert', value: '€124.50', trendDirection: 'up' as const, trend: '+5%' },
        { label: 'Höchster Umsatz/Tag', value: '€856', trendDirection: 'up' as const },
        { label: 'Niedrigster Umsatz/Tag', value: '€42', trendDirection: 'down' as const },
      ],
      [
        { label: 'Aktive Buchungen', value: value, trend: trend },
        { label: 'Neue Buchungen (7T)', value: '12', trendDirection: 'up' as const, trend: '+15%' },
        { label: 'Stornierungen', value: '3', trendDirection: 'down' as const },
        { label: 'Durchschnitt/Tag', value: '2.1', trendDirection: 'up' as const },
      ],
      [
        { label: 'Gesamt Gäste', value: value, trend: trend },
        { label: 'Durchschnitt/Buchung', value: '2.3', trendDirection: 'up' as const },
        { label: 'Erwachsene', value: '85%', trendDirection: 'up' as const },
        { label: 'Kinder', value: '15%', trendDirection: 'down' as const },
      ],
      [
        { label: 'Room Nights', value: value, trend: trend },
        { label: 'Auslastung', value: '67%', trendDirection: 'up' as const, trend: '+8%' },
        { label: 'Ø Aufenthalt', value: '2.4 Nächte', trendDirection: 'up' as const },
        { label: 'Längster Aufenthalt', value: '7 Nächte', trendDirection: 'up' as const },
      ],
    ];

    return {
      title: titles[index] || titles[0],
      description: descriptions[index] || descriptions[0],
      details: detailsList[index] || detailsList[0],
    };
  };

  const modalData = getModalDetails();

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="relative bg-white/55 dark:bg-gray-900/55 backdrop-blur-sm border border-white/55 dark:border-white/8 rounded-3xl p-4 xl:p-5 shadow-lg dark:shadow-2xl min-h-24 flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-xl hover:bg-white/65 dark:hover:bg-gray-900/65 transition-all cursor-pointer text-left w-full">
        {/* Icon and Menu */}
        <div className="flex items-start justify-between mb-3">
          {Icon && (
            <div className="w-6 h-6 text-gray-900/85 dark:text-gray-50/85">
              <Icon className="w-full h-full stroke-[2]" />
            </div>
          )}
          {hasOverflowMenu && (
            <div className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white/15 dark:hover:bg-white/4 transition-colors">
              <MoreVertical className="w-4 h-4 text-gray-900/65 dark:text-gray-50/65" />
            </div>
          )}
        </div>

        {/* Value and Sparkline */}
        <div className="space-y-1">
          <div className="text-2xl xl:text-3xl font-bold text-gray-900 dark:text-gray-50">
            {value}
          </div>
          {sparklineData && sparklineData.length > 0 && (
            <div className="flex items-center justify-start">
              <Sparkline
                data={sparklineData}
                width={80}
                height={20}
                color="currentColor"
                className={`${
                  trend && trend.startsWith('+')
                    ? 'text-green-500 dark:text-green-400'
                    : trend && trend.startsWith('-')
                    ? 'text-red-500 dark:text-red-400'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              />
            </div>
          )}
        </div>

        {/* Label and Trend */}
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm text-gray-900/52 dark:text-gray-50/55 line-clamp-2 flex-1">
            {label}
          </div>
          {trend && trend !== '—' && (
            <span
              className={`flex items-center gap-0.5 text-xs font-semibold ${
                trend.startsWith('+')
                  ? 'text-green-600 dark:text-green-400'
                  : trend.startsWith('-')
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {trend.startsWith('+') ? (
                <TrendingUp className="w-3 h-3" />
              ) : trend.startsWith('-') ? (
                <TrendingDown className="w-3 h-3" />
              ) : (
                <Minus className="w-3 h-3" />
              )}
              {trend}
            </span>
          )}
          {trend === '—' && (
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500">
              —
            </span>
          )}
        </div>
      </button>

      {showModal && (
        <StatCardModal
          title={modalData.title}
          value={value}
          description={modalData.description}
          details={modalData.details}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
