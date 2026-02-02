'use client';

import { Download, FileSpreadsheet, FileText, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { getAllBookings } from '@/lib/booking-storage';

export function ExportButton() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const exportToCSV = () => {
    const bookings = getAllBookings();

    if (bookings.length === 0) {
      alert('Keine Daten zum Exportieren vorhanden');
      return;
    }

    // Get all column headers from the first booking
    const headers = Object.keys(bookings[0]);

    // Create CSV content
    const csvContent = [
      // Header row
      headers.join(','),
      // Data rows
      ...bookings.map(booking =>
        headers.map(header => {
          const value = booking[header as keyof typeof booking];
          // Escape commas and quotes in values
          const stringValue = String(value ?? '');
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        }).join(',')
      )
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    const timestamp = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `hotel-doerenkamp-bookings-${timestamp}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsOpen(false);
  };

  const exportDashboardData = () => {
    // Export a summary of dashboard metrics
    const bookings = getAllBookings();

    if (bookings.length === 0) {
      alert('Keine Daten zum Exportieren vorhanden');
      return;
    }

    // Calculate summary statistics
    const totalBookings = bookings.length;
    const activeBookings = bookings.filter(b => b.Status === 'OK').length;
    const cancelledBookings = bookings.filter(b => b.Status === 'Storniert').length;
    const totalRevenue = bookings
      .filter(b => b.Status === 'OK')
      .reduce((sum, b) => sum + (parseFloat(b['Betrag in EUR '] || '0')), 0);

    const summaryData = [
      ['Dashboard Summary', ''],
      ['Export Date', new Date().toLocaleDateString('de-DE')],
      [''],
      ['Metric', 'Value'],
      ['Total Bookings', totalBookings],
      ['Active Bookings', activeBookings],
      ['Cancelled Bookings', cancelledBookings],
      ['Total Revenue', `€${totalRevenue.toFixed(2)}`],
      [''],
      ['Detailed Bookings', ''],
      [''],
      ...bookings.map(b => [
        b['Gästename(n) '],
        b.Buchungsnummer,
        b.Anreise,
        b.Abreise,
        b.Status,
        b['Betrag in EUR '] || '0'
      ])
    ];

    const csvContent = summaryData.map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    const timestamp = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `hotel-doerenkamp-dashboard-${timestamp}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white/55 dark:bg-gray-900/55 backdrop-blur-sm border border-white/55 dark:border-white/8 rounded-full hover:bg-white/70 dark:hover:bg-gray-900/70 transition-all"
      >
        <Download className="w-3.5 h-3.5 text-gray-900/78 dark:text-gray-50/78" />
        <span className="text-xs font-medium text-gray-900 dark:text-gray-50">
          Export
        </span>
        <ChevronDown className={`w-3 h-3 text-gray-900/78 dark:text-gray-50/78 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-white/55 dark:border-white/8 rounded-2xl shadow-xl z-50 overflow-hidden">
          <div className="py-1">
            <button
              onClick={exportToCSV}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
            >
              <FileSpreadsheet className="w-4 h-4 text-green-600 dark:text-green-400" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-50">
                  Buchungen CSV
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Alle Buchungsdaten
                </div>
              </div>
            </button>

            <button
              onClick={exportDashboardData}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
            >
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-50">
                  Dashboard Summary CSV
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Zusammenfassung + Daten
                </div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
