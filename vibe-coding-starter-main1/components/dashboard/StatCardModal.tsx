'use client';

import { X, TrendingUp, TrendingDown, Info } from 'lucide-react';

interface StatDetail {
  label: string;
  value: string;
  trend?: string;
  trendDirection?: 'up' | 'down';
}

interface StatCardModalProps {
  title: string;
  value: string;
  description: string;
  details: StatDetail[];
  onClose: () => void;
}

export function StatCardModal({
  title,
  value,
  description,
  details,
  onClose,
}: StatCardModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-3xl shadow-2xl max-w-lg w-full border border-white/55 dark:border-white/8 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-1">
                {title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {description}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Main Value */}
          <div className="mt-4 text-4xl font-bold text-gray-900 dark:text-gray-50">
            {value}
          </div>
        </div>

        {/* Details */}
        <div className="p-6">
          <div className="space-y-4">
            {details.map((detail, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl"
              >
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {detail.label}
                  </div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                    {detail.value}
                  </div>
                </div>

                {detail.trend && (
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${
                      detail.trendDirection === 'up'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {detail.trendDirection === 'up' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {detail.trend}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Info Footer */}
          <div className="mt-6 flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-900 dark:text-blue-300">
              Diese Daten basieren auf dem aktuell ausgewählten Zeitraum und allen aktiven Buchungen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
