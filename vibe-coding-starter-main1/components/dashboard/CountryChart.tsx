'use client';

import { Globe, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface CountryData {
  country: string;
  revenue: number;
  bookings: number;
}

interface CountryChartProps {
  data: CountryData[];
  topN?: number;
}

export function CountryChart({ data, topN = 5 }: CountryChartProps) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const formatEuro = (amount: number) =>
    `€${amount.toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  // Get top N countries
  const topCountries = data.slice(0, topN);

  // Calculate max revenue for bar scaling
  const maxRevenue = topCountries.length > 0 ? topCountries[0].revenue : 0;

  // Country flag emoji mapping (common countries)
  const flagMap: Record<string, string> = {
    Germany: '🇩🇪',
    Netherlands: '🇳🇱',
    Belgium: '🇧🇪',
    France: '🇫🇷',
    Spain: '🇪🇸',
    Italy: '🇮🇹',
    'United Kingdom': '🇬🇧',
    USA: '🇺🇸',
    China: '🇨🇳',
    Japan: '🇯🇵',
    Switzerland: '🇨🇭',
    Austria: '🇦🇹',
    Poland: '🇵🇱',
    Denmark: '🇩🇰',
    Sweden: '🇸🇪',
    Norway: '🇳🇴',
    Finland: '🇫🇮',
  };

  return (
    <div className="bg-white/55 dark:bg-gray-900/55 backdrop-blur-sm border border-white/55 dark:border-white/8 rounded-3xl p-5 xl:p-6 shadow-lg dark:shadow-2xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-50">
            Umsatz nach Land
          </h3>
          <p className="text-xs text-gray-900/52 dark:text-gray-50/55 mt-0.5">
            Top {topN} Märkte
          </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-primary-500/10 dark:bg-primary-500/20 flex items-center justify-center">
          <Globe className="w-4 h-4 text-primary-600 dark:text-primary-400 stroke-[2]" />
        </div>
      </div>

      {/* Country List */}
      {topCountries.length === 0 ? (
        <div className="text-center py-8 text-gray-900/52 dark:text-gray-50/55">
          Keine Daten verfügbar
        </div>
      ) : (
        <div className="space-y-4">
          {topCountries.map((item, index) => {
            const percentage = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
            const flag = flagMap[item.country] || '🌍';

            return (
              <div
                key={item.country}
                className="group cursor-pointer transition-all"
                onMouseEnter={() => setHoveredCountry(item.country)}
                onMouseLeave={() => setHoveredCountry(null)}
                onClick={() => {
                  // TODO: Could filter dashboard to show only this country's data
                  console.log('Clicked country:', item.country, item);
                }}
              >
                {/* Country Name and Revenue */}
                <div className={`flex items-center justify-between mb-2 transition-all ${
                  hoveredCountry === item.country ? 'scale-105' : ''
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{flag}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-50">
                      {item.country}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-50">
                      {formatEuro(item.revenue)}
                    </div>
                    <div className="text-xs text-gray-900/52 dark:text-gray-50/55">
                      {item.bookings} Buchung{item.bookings !== 1 ? 'en' : ''}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative h-2 bg-white/30 dark:bg-gray-800/30 rounded-full overflow-hidden">
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-500 ${
                      hoveredCountry === item.country ? 'shadow-lg' : ''
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                  {hoveredCountry === item.country && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <TrendingUp className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
