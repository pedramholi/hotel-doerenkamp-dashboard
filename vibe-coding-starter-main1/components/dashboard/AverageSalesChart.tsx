'use client';

import { useState } from 'react';

interface ChartData {
  month: string;
  value: number;
}

interface MetricData {
  label: string;
  value: string;
  delta: string;
  tone: 'success' | 'danger';
}

interface TooltipData {
  label: string;
  color: string;
}

interface AverageSalesChartProps {
  title: string;
  subtitle: string;
  metrics: MetricData[];
  data: ChartData[];
  activeMonth: string;
  tooltipData: TooltipData[];
}

export function AverageSalesChart({
  title,
  subtitle,
  metrics,
  data,
  activeMonth,
  tooltipData,
}: AverageSalesChartProps) {
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);
  const maxValue = Math.max(...data.map((d) => d.value));
  const yAxisTicks = ['0', '$200', '$400', '$600', '$800', '$1k', '$1.2k'];

  return (
    <div className="bg-white/55 dark:bg-gray-900/55 backdrop-blur-sm border border-white/55 dark:border-white/8 rounded-3xl p-5 xl:p-6 shadow-lg dark:shadow-2xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h3 className="text-base xl:text-lg font-bold text-gray-900 dark:text-gray-50 mb-1">
            {title}
          </h3>
          <p className="text-sm text-gray-900/52 dark:text-gray-50/55">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {metrics.map((metric, index) => (
          <div key={index} className="flex items-baseline gap-3">
            <div>
              <div className="text-xs text-gray-900/52 dark:text-gray-50/55 mb-1">
                {metric.label}
              </div>
              <div className="text-2xl xl:text-3xl font-bold text-gray-900 dark:text-gray-50">
                {metric.value.split('.')[0]}
                <span className="opacity-35">.{metric.value.split('.')[1]}</span>
              </div>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                metric.tone === 'success'
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              }`}
            >
              {metric.delta}
            </span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="relative">
        {/* Y-Axis and Grid */}
        <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-900/52 dark:text-gray-50/55 pr-2">
          {yAxisTicks.reverse().map((tick, index) => (
            <div key={index} className="relative">
              <span>{tick}</span>
              {index > 0 && (
                <div
                  className="absolute left-full top-1/2 w-screen border-t border-dotted border-gray-400/35 dark:border-gray-500/25"
                  style={{ marginLeft: '8px' }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Bars */}
        <div className="ml-12 h-72 flex items-end justify-between gap-2 relative">
          {data.map((item, index) => {
            const isActive = item.month === activeMonth;
            const isHovered = hoveredBar === item.month;
            const heightPercent = (item.value / maxValue) * 100;

            return (
              <div
                key={item.month}
                className="flex-1 flex flex-col items-center gap-2 cursor-pointer"
                onMouseEnter={() => setHoveredBar(item.month)}
                onMouseLeave={() => setHoveredBar(null)}
                onClick={() => {
                  // TODO: Could open a detailed modal for this day's data
                  console.log('Clicked:', item.month, item.value);
                }}
              >
                {/* Tooltip */}
                {isHovered && (
                  <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl p-3 shadow-xl z-10 border border-white/55 dark:border-white/8 min-w-[140px]">
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      {item.month}
                    </div>
                    <div className="text-base font-bold text-gray-900 dark:text-gray-50">
                      €{item.value.toLocaleString('de-DE')}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Click for details
                    </div>
                  </div>
                )}

                {/* Bar */}
                <div className="w-full flex items-end justify-center h-64">
                  <div
                    className={`w-full max-w-10 rounded-xl transition-all relative overflow-hidden ${
                      isHovered ? 'scale-105 shadow-lg' : ''
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  >
                    {isActive ? (
                      <>
                        {/* Active bar with diagonal hatch pattern */}
                        <svg
                          className="absolute inset-0 w-full h-full"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <defs>
                            <pattern
                              id="diagonalHatch"
                              patternUnits="userSpaceOnUse"
                              width="8"
                              height="8"
                              patternTransform="rotate(-35)"
                            >
                              <rect
                                width="8"
                                height="8"
                                className="fill-primary-600/65 dark:fill-primary-500/65"
                              />
                              <line
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="8"
                                className="stroke-white/20 dark:stroke-black/20"
                                strokeWidth="4"
                              />
                            </pattern>
                          </defs>
                          <rect
                            width="100%"
                            height="100%"
                            fill="url(#diagonalHatch)"
                            className="rounded-xl"
                          />
                        </svg>
                      </>
                    ) : (
                      <div
                        className={`w-full h-full rounded-xl ${
                          index % 2 === 0
                            ? 'bg-primary-500/14 dark:bg-primary-500/12'
                            : 'bg-primary-500/10 dark:bg-primary-500/10'
                        }`}
                      />
                    )}
                  </div>
                </div>

                {/* Label */}
                <span className="text-xs text-gray-900/52 dark:text-gray-50/55">
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
