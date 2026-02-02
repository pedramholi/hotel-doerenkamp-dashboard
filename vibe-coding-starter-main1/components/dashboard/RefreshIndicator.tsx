'use client';

import { RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';

interface RefreshIndicatorProps {
  onRefresh: () => void;
  autoRefreshMinutes?: number; // 0 = disabled
}

export function RefreshIndicator({
  onRefresh,
  autoRefreshMinutes = 0
}: RefreshIndicatorProps) {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeAgo, setTimeAgo] = useState('Gerade eben');

  // Update "time ago" display every 10 seconds
  useEffect(() => {
    const updateTimeAgo = () => {
      const now = new Date();
      const diffMs = now.getTime() - lastUpdate.getTime();
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins === 0) {
        setTimeAgo('Gerade eben');
      } else if (diffMins === 1) {
        setTimeAgo('Vor 1 Minute');
      } else if (diffMins < 60) {
        setTimeAgo(`Vor ${diffMins} Minuten`);
      } else {
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours === 1) {
          setTimeAgo('Vor 1 Stunde');
        } else {
          setTimeAgo(`Vor ${diffHours} Stunden`);
        }
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 10000);
    return () => clearInterval(interval);
  }, [lastUpdate]);

  // Auto-refresh if enabled
  useEffect(() => {
    if (autoRefreshMinutes <= 0) return;

    const interval = setInterval(() => {
      handleRefresh();
    }, autoRefreshMinutes * 60 * 1000);

    return () => clearInterval(interval);
  }, [autoRefreshMinutes]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setLastUpdate(new Date());

    // Simulate a brief loading state
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/55 dark:bg-gray-900/55 backdrop-blur-sm border border-white/55 dark:border-white/8 rounded-full">
      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        className={`
          w-6 h-6 rounded-full flex items-center justify-center
          hover:bg-white/30 dark:hover:bg-white/10 transition-colors
          ${isRefreshing ? 'cursor-not-allowed' : 'cursor-pointer'}
        `}
        title="Dashboard aktualisieren"
      >
        <RefreshCw
          className={`w-3.5 h-3.5 text-gray-900/78 dark:text-gray-50/78 ${
            isRefreshing ? 'animate-spin' : ''
          }`}
        />
      </button>

      <div className="flex items-center gap-1.5">
        <span className="text-xs text-gray-900/52 dark:text-gray-50/55">
          {timeAgo}
        </span>
        {autoRefreshMinutes > 0 && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
            Auto
          </span>
        )}
      </div>
    </div>
  );
}
