'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, X, ArrowRight, Command } from 'lucide-react';
import { getAllBookings, StoredBooking } from '@/lib/booking-storage';
import { useRouter } from 'next/navigation';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState<StoredBooking[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setBookings(getAllBookings());
      setSearchQuery('');
    }
  }, [isOpen]);

  // Search through bookings
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return bookings
      .filter((booking) => {
        return (
          booking['Gästename(n) ']?.toLowerCase().includes(query) ||
          booking.Buchungsnummer?.toString().includes(query) ||
          booking.Zimmertyp?.toLowerCase().includes(query) ||
          booking.Status?.toLowerCase().includes(query) ||
          booking.Land?.toLowerCase().includes(query)
        );
      })
      .slice(0, 10); // Limit to 10 results
  }, [bookings, searchQuery]);

  const handleSelectBooking = useCallback(
    (booking: StoredBooking) => {
      // Store the selected booking number in sessionStorage so the Buchungen page can highlight it
      sessionStorage.setItem('selectedBooking', booking.Buchungsnummer.toString());
      router.push('/dashboard/buchungen');
      onClose();
    },
    [router, onClose]
  );

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Search Modal */}
      <div className="relative w-full max-w-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/55 dark:border-white/8 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
          <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Suche nach Gast, Buchungsnummer, Zimmer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-gray-900 dark:text-gray-50 placeholder-gray-400 outline-none text-base"
          />
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {searchQuery.trim() === '' ? (
            <div className="p-8 text-center">
              <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Schnellsuche über alle Buchungen
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                  <Command className="w-3 h-3 inline" /> K
                </kbd>
                <span>zum Öffnen</span>
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Keine Ergebnisse gefunden für "{searchQuery}"
              </p>
            </div>
          ) : (
            <div className="py-2">
              {searchResults.map((booking) => (
                <button
                  key={booking.Buchungsnummer}
                  onClick={() => handleSelectBooking(booking)}
                  className="w-full px-4 py-3 flex items-center justify-between gap-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900 dark:text-gray-50 truncate">
                        {booking['Gästename(n) ']}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          booking.Status === 'OK'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : booking.Status === 'Storniert'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                        }`}
                      >
                        {booking.Status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                      <span>#{booking.Buchungsnummer}</span>
                      <span>•</span>
                      <span>{booking.Zimmertyp}</span>
                      <span>•</span>
                      <span>
                        {new Date(booking.Anreise).toLocaleDateString('de-DE')}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {searchResults.length > 0 && (
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              {searchResults.length} von {bookings.length} Buchungen
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
