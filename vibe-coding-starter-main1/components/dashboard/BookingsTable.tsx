import { StoredBooking } from '@/lib/booking-storage';
import { BookingStatusBadge } from './BookingStatusBadge';
import { ArrowUpDown } from 'lucide-react';

interface BookingsTableProps {
  bookings: StoredBooking[];
  isLoading: boolean;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
}

export function BookingsTable({
  bookings,
  isLoading,
  sortField,
  sortDirection,
  onSort,
}: BookingsTableProps) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatCurrency = (priceStr: string) => {
    if (!priceStr) return '-';
    // Remove currency symbols and parse
    const amount = parseFloat(priceStr.replace(/[^0-9.-]/g, ''));
    if (isNaN(amount)) return priceStr;
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const SortableHeader = ({ field, label }: { field: string; label: string }) => (
    <th
      className="px-4 py-3 text-left text-xs font-medium text-gray-900/70 dark:text-gray-50/70 uppercase tracking-wider cursor-pointer hover:bg-white/15 dark:hover:bg-white/4 transition-colors"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown className="w-3 h-3" />
      </div>
    </th>
  );

  if (isLoading) {
    return (
      <div className="bg-white/55 dark:bg-gray-900/55 backdrop-blur-sm rounded-3xl p-8 border border-white/55 dark:border-white/8 shadow-lg dark:shadow-2xl">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Lade Buchungen...</p>
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-white/55 dark:bg-gray-900/55 backdrop-blur-sm rounded-3xl p-8 border border-white/55 dark:border-white/8 shadow-lg dark:shadow-2xl">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Keine Buchungen gefunden</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/55 dark:bg-gray-900/55 backdrop-blur-sm rounded-3xl border border-white/55 dark:border-white/8 shadow-lg dark:shadow-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/30 dark:bg-gray-800/30 border-b border-white/55 dark:border-white/8">
            <tr>
              <SortableHeader field="Gästename(n) " label="Gast" />
              <SortableHeader field="Anreise" label="Anreise" />
              <SortableHeader field="Abreise" label="Abreise" />
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-900/70 dark:text-gray-50/70 uppercase tracking-wider">
                Zimmer
              </th>
              <SortableHeader field="Gebucht am" label="Gebucht am" />
              <SortableHeader field="Status" label="Status" />
              <SortableHeader field="Preis" label="Preis" />
              <th className="hidden xl:table-cell px-4 py-3 text-left text-xs font-medium text-gray-900/70 dark:text-gray-50/70 uppercase tracking-wider">
                Kommission
              </th>
              <SortableHeader field="Buchungsnummer" label="Buchungsnr." />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/55 dark:divide-white/8">
            {bookings.map((booking) => (
              <tr
                key={booking.Buchungsnummer}
                className="hover:bg-white/15 dark:hover:bg-white/4 transition-colors"
              >
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-50">
                  <div className="font-medium">{booking['Gästename(n) ']}</div>
                  <div className="text-xs text-gray-900/52 dark:text-gray-50/55 hidden sm:block">
                    {booking.Personen} Person{booking.Personen > 1 ? 'en' : ''}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-50 whitespace-nowrap">
                  {formatDate(booking.Anreise)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-50 whitespace-nowrap">
                  {formatDate(booking.Abreise)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-50">
                  <div>{booking['Art der Wohneinheit']}</div>
                  <div className="text-xs text-gray-900/52 dark:text-gray-50/55 hidden sm:block">
                    {booking['Aufenthaltsdauer (Nächte)']} Nächte
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-50 whitespace-nowrap">
                  {formatDate(booking['Gebucht am'])}
                </td>
                <td className="px-4 py-3">
                  <BookingStatusBadge status={booking.Status} />
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-50 whitespace-nowrap">
                  {formatCurrency(booking.Preis)}
                </td>
                <td className="hidden xl:table-cell px-4 py-3 text-sm text-gray-900 dark:text-gray-50">
                  <div>{formatCurrency(booking.Kommissionsbetrag)}</div>
                  <div className="text-xs text-gray-900/52 dark:text-gray-50/55">
                    {booking['Kommission %']}%
                  </div>
                </td>
                <td className="px-4 py-3 text-sm font-mono text-gray-900/70 dark:text-gray-50/70 whitespace-nowrap">
                  #{booking.Buchungsnummer}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
