'use client';

import { ArrowUpRight } from 'lucide-react';

interface SuccessRateProps {
  title: string;
  subtitle: string;
  value: number;
  supportingText: string;
  miniStats: Array<{ label: string; value: string }>;
}

export function SuccessRate({
  title,
  subtitle,
  value,
  supportingText,
  miniStats,
}: SuccessRateProps) {
  const segments = 22;
  const activeSegments = Math.round(segments * value);

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
        <button className="w-9 h-9 rounded-full bg-white/65 dark:bg-white/6 flex items-center justify-center hover:bg-white/80 dark:hover:bg-white/10 transition-colors flex-shrink-0">
          <ArrowUpRight className="w-5 h-5 text-gray-900/85 dark:text-gray-50/85 stroke-[2]" />
        </button>
      </div>

      {/* Circular Gauge */}
      <div className="relative flex items-center justify-center mb-6">
        {/* Tooltip Pill */}
        <div className="absolute -top-2 -left-2 bg-white/85 dark:bg-gray-900/85 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg flex items-center gap-2 z-10">
          <div className="w-2 h-2 rounded-full bg-primary-500" />
          <span className="text-xs font-semibold text-gray-900 dark:text-gray-50">
            {(value * 100).toFixed(1)}%
          </span>
        </div>

        <svg className="w-48 h-48" viewBox="0 0 200 200">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" className="stop-color-primary-400" />
              <stop offset="100%" className="stop-color-primary-500" />
            </linearGradient>
          </defs>

          {/* Segments */}
          {Array.from({ length: segments }).map((_, index) => {
            const startAngle = -135 + (index * 270) / segments;
            const endAngle = -135 + ((index + 1) * 270) / segments;
            const isActive = index < activeSegments;

            const radius = 80;
            const innerRadius = 60;

            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;

            const x1 = 100 + radius * Math.cos(startRad);
            const y1 = 100 + radius * Math.sin(startRad);
            const x2 = 100 + radius * Math.cos(endRad);
            const y2 = 100 + radius * Math.sin(endRad);

            const ix1 = 100 + innerRadius * Math.cos(startRad);
            const iy1 = 100 + innerRadius * Math.sin(startRad);
            const ix2 = 100 + innerRadius * Math.cos(endRad);
            const iy2 = 100 + innerRadius * Math.sin(endRad);

            const largeArc = endAngle - startAngle > 180 ? 1 : 0;

            return (
              <path
                key={index}
                d={`
                  M ${x1} ${y1}
                  A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
                  L ${ix2} ${iy2}
                  A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1}
                  Z
                `}
                className={
                  isActive
                    ? 'fill-primary-400 dark:fill-primary-400'
                    : 'fill-white/65 dark:fill-white/10'
                }
              />
            );
          })}

          {/* Center Text */}
          <text
            x="100"
            y="95"
            textAnchor="middle"
            className="text-3xl font-bold fill-gray-900 dark:fill-gray-50"
          >
            {(value * 100).toFixed(1)}%
          </text>
          <text
            x="100"
            y="115"
            textAnchor="middle"
            className="text-sm fill-green-500 dark:fill-green-400"
          >
            +5%
          </text>
        </svg>
      </div>

      {/* Supporting Text */}
      <p className="text-xs text-gray-900/52 dark:text-gray-50/55 mb-6 leading-relaxed">
        {supportingText}
      </p>

      {/* Mini Stats */}
      <div className="grid grid-cols-2 gap-4">
        {miniStats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-xs text-gray-900/52 dark:text-gray-50/55 mb-1">
              {stat.label}
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-gray-50">
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
