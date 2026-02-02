'use client';

import { useState, useEffect, useMemo } from 'react';
import { getAllBookings, StoredBooking } from '@/lib/booking-storage';
import { GlassNav } from '@/components/dashboard/GlassNav';
import { BookingsTable } from '@/components/dashboard/BookingsTable';
import { BookingsSearchBar } from '@/components/dashboard/BookingsSearchBar';

export default function BuchungenPage() {
  const [bookings, setBookings] = useState<StoredBooking[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('Anreise');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setBookings(getAllBookings());
    setIsLoading(false);
  }, []);

  const filteredBookings = useMemo(() => {
    let filtered = bookings;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (b) =>
          b['Gästename(n) '].toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.Buchungsnummer.toString().includes(searchQuery)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((b) => b.Status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aVal = a[sortField as keyof StoredBooking];
      const bVal = b[sortField as keyof StoredBooking];

      // Handle null/undefined values
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      // Compare values
      let comparison = 0;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        comparison = aVal.localeCompare(bVal);
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal;
      } else {
        comparison = String(aVal).localeCompare(String(bVal));
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [bookings, searchQuery, statusFilter, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-violet-50/60 via-sky-50/40 to-rose-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Background Decorative Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-30 dark:opacity-20"
          style={{
            background:
              'radial-gradient(circle, rgba(139, 92, 246, 0.18), transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-25 dark:opacity-15"
          style={{
            background:
              'radial-gradient(circle, rgba(14, 165, 233, 0.12), transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] rounded-full blur-3xl opacity-20 dark:opacity-10"
          style={{
            background:
              'radial-gradient(circle, rgba(244, 63, 94, 0.14), transparent 70%)',
          }}
        />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full min-h-screen px-4 md:px-5 xl:px-6 py-5 xl:py-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-gray-50/40 via-white/30 to-gray-50/40 dark:from-gray-900/40 dark:via-gray-800/30 dark:to-gray-900/40 backdrop-blur-sm rounded-3xl xl:rounded-[2rem] p-4 md:p-5 xl:p-6 shadow-2xl border border-white/20 dark:border-white/5">
            {/* Navigation */}
            <div className="mb-4">
              <GlassNav />
            </div>

            {/* Header */}
            <div className="mb-4 px-1">
              <h1 className="text-xl xl:text-2xl font-bold text-gray-900 dark:text-gray-50">
                Buchungen
              </h1>
              <p className="text-sm text-gray-900/52 dark:text-gray-50/55">
                {bookings.length} Buchungen insgesamt
                {filteredBookings.length !== bookings.length &&
                  ` • ${filteredBookings.length} gefiltert`}
              </p>
            </div>

            {/* Search and Filter */}
            <div className="mb-4">
              <BookingsSearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
              />
            </div>

            {/* Bookings Table */}
            <BookingsTable
              bookings={filteredBookings}
              isLoading={isLoading}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
