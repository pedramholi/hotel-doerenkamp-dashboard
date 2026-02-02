'use client';

import { CheckCircle, X } from 'lucide-react';
import { useEffect } from 'react';

interface ImportResultToastProps {
  result: {
    added: number;
    updated: number;
    skipped: number;
  };
  onClose: () => void;
}

export function ImportResultToast({ result, onClose }: ImportResultToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-green-200 dark:border-green-800 rounded-2xl shadow-2xl p-4 min-w-[320px] max-w-md">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>

          <div className="flex-1 pt-0.5">
            <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-2">
              Import erfolgreich!
            </h3>

            <div className="space-y-1 text-sm">
              {result.added > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Neue Buchungen:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    +{result.added}
                  </span>
                </div>
              )}

              {result.updated > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Aktualisiert:</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    {result.updated}
                  </span>
                </div>
              )}

              {result.skipped > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Übersprungen:</span>
                  <span className="font-medium text-gray-600 dark:text-gray-400">
                    {result.skipped}
                  </span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
}
