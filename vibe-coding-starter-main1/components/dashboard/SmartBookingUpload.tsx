'use client';

import { Upload, FileSpreadsheet, CheckCircle } from 'lucide-react';
import { useRef, useState } from 'react';
import { UpdateConfirmDialog } from './UpdateConfirmDialog';
import {
  analyzeBookings,
  mergeBookings,
  type StoredBooking,
  type UpdateDiff,
} from '@/lib/booking-storage';

interface SmartBookingUploadProps {
  onImportComplete?: () => void;
}

export function SmartBookingUpload({ onImportComplete }: SmartBookingUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [pendingUpdates, setPendingUpdates] = useState<UpdateDiff[]>([]);
  const [pendingBookings, setPendingBookings] = useState<StoredBooking[]>([]);
  const [result, setResult] = useState<{
    added: number;
    updated: number;
    skipped: number;
  } | null>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase();

    if (!['xls', 'xlsx'].includes(extension || '')) {
      alert('Bitte wähle eine .xls oder .xlsx Datei');
      return;
    }

    setFileName(file.name);
    setIsProcessing(true);
    setResult(null);

    try {
      // Read file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();

      // Parse with xlsx library (must be installed)
      // xlsx will be loaded globally or via import
      if (typeof window !== 'undefined' && !((window as Window & { XLSX?: unknown }).XLSX)) {
        alert(
          'Excel-Parser nicht verfügbar.\n\nBitte installieren:\nnpm install xlsx\n\nOder verwende den Python-Prozessor.'
        );
        setIsProcessing(false);
        return;
      }

      const XLSX = (window as Window & { XLSX?: { read: (data: ArrayBuffer, opts: { type: string }) => { SheetNames: string[]; Sheets: Record<string, unknown> }; utils: { sheet_to_json: (sheet: unknown) => StoredBooking[] } } }).XLSX;

      if (!XLSX) {
        alert('XLSX library not loaded');
        setIsProcessing(false);
        return;
      }

      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData: StoredBooking[] = XLSX.utils.sheet_to_json(worksheet);

      // Analyze bookings
      const analysis = analyzeBookings(jsonData);

      console.log('Import Analysis:', {
        new: analysis.newBookings.length,
        duplicatesNoChange: analysis.duplicatesNoChange.length,
        duplicatesWithUpdates: analysis.duplicatesWithUpdates.length,
      });

      // If there are updates, show confirmation dialog
      if (analysis.duplicatesWithUpdates.length > 0) {
        setPendingUpdates(analysis.duplicatesWithUpdates);
        setPendingBookings(jsonData);
        setIsProcessing(false);
      } else {
        // No updates needed, just merge new bookings
        const mergeResult = mergeBookings(jsonData, false);
        setResult(mergeResult);
        setIsProcessing(false);

        // Show success message
        setTimeout(() => {
          alert(
            `✓ Import erfolgreich!\n\n` +
            `${mergeResult.added} neue Buchungen hinzugefügt\n` +
            `${mergeResult.skipped} Duplikate übersprungen`
          );

          // Notify parent
          if (onImportComplete) {
            onImportComplete();
          }
        }, 100);
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setFileName(null);
    } catch (error) {
      console.error('Error processing file:', error);
      setIsProcessing(false);
      alert('Fehler beim Verarbeiten der Datei. Bitte versuche es erneut.');
    }
  };

  const handleUpdateConfirm = (applyUpdates: boolean) => {
    const mergeResult = mergeBookings(pendingBookings, applyUpdates);
    setResult(mergeResult);
    setPendingUpdates([]);
    setPendingBookings([]);

    // Show result
    setTimeout(() => {
      alert(
        `✓ Import erfolgreich!\n\n` +
        `${mergeResult.added} neue Buchungen hinzugefügt\n` +
        `${mergeResult.updated} Buchungen aktualisiert\n` +
        `${mergeResult.skipped} Buchungen übersprungen`
      );

      // Notify parent
      if (onImportComplete) {
        onImportComplete();
      }
    }, 100);
  };

  const handleUpdateCancel = () => {
    setPendingUpdates([]);
    setPendingBookings([]);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <div className="bg-white/55 dark:bg-gray-900/55 backdrop-blur-sm border border-white/55 dark:border-white/8 rounded-3xl p-5 xl:p-6 shadow-lg dark:shadow-2xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-base xl:text-lg font-bold text-gray-900 dark:text-gray-50 mb-1">
              Buchungen importieren
            </h3>
            <p className="text-sm text-gray-900/52 dark:text-gray-50/55">
              Booking.com Excel-Dateien hochladen
            </p>
          </div>
          <FileSpreadsheet className="w-6 h-6 text-primary-500" />
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".xls,.xlsx"
          onChange={handleFileSelect}
          className="hidden"
        />

        <button
          onClick={handleClick}
          disabled={isProcessing}
          className="w-full h-12 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white rounded-full text-sm font-medium transition-colors flex items-center justify-center gap-2 mb-4"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Verarbeite...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              {fileName || 'Excel-Datei auswählen (.xls, .xlsx)'}
            </>
          )}
        </button>

        {result && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 mb-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-green-900 dark:text-green-100 mb-1">
                  Import erfolgreich!
                </div>
                <div className="text-xs text-green-700 dark:text-green-300 space-y-0.5">
                  <div>✓ {result.added} neue Buchungen hinzugefügt</div>
                  {result.updated > 0 && (
                    <div>✓ {result.updated} Buchungen aktualisiert</div>
                  )}
                  {result.skipped > 0 && (
                    <div>• {result.skipped} Duplikate übersprungen</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="text-xs font-semibold text-gray-900 dark:text-gray-50">
            Funktionen:
          </div>
          <ul className="text-xs text-gray-900/52 dark:text-gray-50/55 space-y-1 pl-4">
            <li>✓ Automatische Duplikat-Erkennung (Buchungsnummer)</li>
            <li>✓ Update-Prüfung für vorhandene Buchungen</li>
            <li>✓ Bestätigung vor Überschreiben von Daten</li>
            <li>✓ Lokale Speicherung (localStorage)</li>
          </ul>
        </div>
      </div>

      {/* Update Confirmation Dialog */}
      {pendingUpdates.length > 0 && (
        <UpdateConfirmDialog
          updates={pendingUpdates}
          onConfirm={handleUpdateConfirm}
          onCancel={handleUpdateCancel}
        />
      )}
    </>
  );
}
