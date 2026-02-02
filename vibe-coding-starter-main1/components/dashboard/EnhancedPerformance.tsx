import { Target, TrendingUp } from 'lucide-react';

interface EnhancedPerformanceProps {
  title: string;
  subtitle: string;
  futureOccupancy: number;
  metrics: Array<{ label: string; value: string }>;
}

export function EnhancedPerformance({
  title,
  subtitle,
  futureOccupancy,
  metrics,
}: EnhancedPerformanceProps) {
  const formatPercent = (value: number) =>
    `${value.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;

  return (
    <div className="bg-white/55 dark:bg-gray-900/55 backdrop-blur-sm border border-white/55 dark:border-white/8 rounded-3xl p-5 xl:p-6 shadow-lg dark:shadow-2xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-50">
            {title}
          </h3>
          <p className="text-xs text-gray-900/52 dark:text-gray-50/55 mt-0.5">
            {subtitle}
          </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-primary-500/10 dark:bg-primary-500/20 flex items-center justify-center">
          <Target className="w-4 h-4 text-primary-600 dark:text-primary-400 stroke-[2]" />
        </div>
      </div>

      {/* Future Occupancy */}
      <div className="mb-4 p-4 bg-white/30 dark:bg-gray-800/30 rounded-2xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <span className="text-xs font-medium text-gray-900/70 dark:text-gray-50/70">
              Zukünftige Auslastung (30 Tage)
            </span>
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-gray-50">
            {formatPercent(futureOccupancy)}
          </span>
        </div>
        <div className="relative h-2 bg-white/30 dark:bg-gray-700/30 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-500"
            style={{ width: `${futureOccupancy}%` }}
          />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="space-y-3">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-2 border-b border-white/55 dark:border-white/8 last:border-0"
          >
            <span className="text-sm text-gray-900/70 dark:text-gray-50/70">
              {metric.label}
            </span>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-50">
              {metric.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
