'use client';

import { ArrowUpRight } from 'lucide-react';

interface FormationStatusProps {
  title: string;
  subtitle: string;
  progress: number;
  estimateTitle: string;
  estimateSubtitle: string;
  ctaLabel: string;
}

export function FormationStatus({
  title,
  subtitle,
  progress,
  estimateTitle,
  estimateSubtitle,
  ctaLabel,
}: FormationStatusProps) {
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

      {/* Progress Bar with Hatch Pattern */}
      <div className="mb-6">
        <div className="h-5 bg-white/75 dark:bg-white/6 rounded-full overflow-hidden relative">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="progressHatch"
                patternUnits="userSpaceOnUse"
                width="8"
                height="8"
                patternTransform="rotate(-35)"
              >
                <rect
                  width="8"
                  height="8"
                  className="fill-primary-400 dark:fill-primary-500"
                />
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="8"
                  className="stroke-white/22 dark:stroke-black/22"
                  strokeWidth="3"
                />
              </pattern>
            </defs>
            <rect
              width={`${progress * 100}%`}
              height="100%"
              fill="url(#progressHatch)"
              className="rounded-full"
            />
          </svg>
        </div>
      </div>

      {/* Estimate Info */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-gray-900 dark:text-gray-50 mb-1">
          {estimateTitle}
        </h4>
        <p className="text-sm text-gray-900/78 dark:text-gray-50/78">
          {estimateSubtitle}
        </p>
      </div>

      {/* CTA Button */}
      <button className="w-full h-11 bg-white/85 dark:bg-white/8 text-gray-900 dark:text-gray-50 rounded-full text-sm font-medium hover:bg-white/95 dark:hover:bg-white/12 transition-colors">
        {ctaLabel}
      </button>
    </div>
  );
}
