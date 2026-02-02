import { TrendingUp } from 'lucide-react';

interface RevPARCardProps {
  revPAR: number;
  cancellationRate: number;
  distributionCost: number;
}

export function RevPARCard({
  revPAR,
  cancellationRate,
  distributionCost,
}: RevPARCardProps) {
  const formatEuro = (amount: number) =>
    `€${amount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const formatPercent = (value: number) =>
    `${value.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;

  return (
    <div className="bg-white/55 dark:bg-gray-900/55 backdrop-blur-sm border border-white/55 dark:border-white/8 rounded-3xl p-5 xl:p-6 shadow-lg dark:shadow-2xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-50">
            RevPAR
          </h3>
          <p className="text-xs text-gray-900/52 dark:text-gray-50/55 mt-0.5">
            Revenue Per Available Room
          </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-primary-500/10 dark:bg-primary-500/20 flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-primary-600 dark:text-primary-400 stroke-[2]" />
        </div>
      </div>

      {/* Main Value */}
      <div className="mb-4">
        <div className="text-3xl xl:text-4xl font-bold text-gray-900 dark:text-gray-50">
          {formatEuro(revPAR)}
        </div>
        <p className="text-xs text-gray-900/52 dark:text-gray-50/55 mt-1">
          per Zimmer pro Tag
        </p>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-2 gap-3">
        {/* Cancellation Rate */}
        <div className="bg-white/30 dark:bg-gray-800/30 rounded-2xl p-3">
          <div className="text-xs text-gray-900/52 dark:text-gray-50/55 mb-1">
            Stornierungsrate
          </div>
          <div className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            {formatPercent(cancellationRate)}
          </div>
        </div>

        {/* Distribution Cost */}
        <div className="bg-white/30 dark:bg-gray-800/30 rounded-2xl p-3">
          <div className="text-xs text-gray-900/52 dark:text-gray-50/55 mb-1">
            Vertriebskosten
          </div>
          <div className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            {formatPercent(distributionCost)}
          </div>
        </div>
      </div>
    </div>
  );
}
