'use client';

import { Calendar, ArrowUpRight } from 'lucide-react';
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
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-900/78 dark:text-gray-50/78 hover:text-gray-900 dark:hover:text-gray-50 transition-colors">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Current Month</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <button className="w-9 h-9 rounded-full bg-white/65 dark:bg-white/6 flex items-center justify-center hover:bg-white/80 dark:hover:bg-white/10 transition-colors">
            <ArrowUpRight className="w-5 h-5 text-gray-900/85 dark:text-gray-50/85 stroke-[2]" />
          </button>
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
                className="flex-1 flex flex-col items-center gap-2"
                onMouseEnter={() => setHoveredBar(item.month)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {/* Tooltip */}
                {isHovered && (
                  <div className="absolute -top-24 bg-white/85 dark:bg-gray-900/85 backdrop-blur-sm rounded-xl p-3 shadow-lg z-10">
                    {tooltipData.map((data, idx) => (
                      <div key={idx} className="flex items-center gap-2 mb-1 last:mb-0">
                        <div className={`w-2 h-2 rounded-full bg-${data.color}`} />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-50">
                          {data.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Bar */}
                <div className="w-full flex items-end justify-center h-64">
                  <div
                    className="w-full max-w-10 rounded-xl transition-all relative overflow-hidden"
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
