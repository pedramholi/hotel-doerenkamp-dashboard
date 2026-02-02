'use client';

import { Upload, CheckCircle } from 'lucide-react';
import { useRef, useState } from 'react';
import { UpdateConfirmDialog } from './UpdateConfirmDialog';
import {
  analyzeBookings,
  mergeBookings,
  type StoredBooking,
  type UpdateDiff,
} from '@/lib/booking-storage';

interface CompactUploadButtonProps {
  onImportComplete?: () => void;
}

export function CompactUploadButton({ onImportComplete }: CompactUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingUpdates, setPendingUpdates] = useState<UpdateDiff[]>([]);
  const [pendingBookings, setPendingBookings] = useState<StoredBooking[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase();

    if (!['xls', 'xlsx'].includes(extension || '')) {
      alert('Bitte wähle eine .xls oder .xlsx Datei');
      return;
    }

    setIsProcessing(true);
    setShowSuccess(false);

    try {
      const arrayBuffer = await file.arrayBuffer();

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

      const analysis = analyzeBookings(jsonData);

      if (analysis.duplicatesWithUpdates.length > 0) {
        setPendingUpdates(analysis.duplicatesWithUpdates);
        setPendingBookings(jsonData);
        setIsProcessing(false);
      } else {
        const result = mergeBookings(jsonData, true);
        console.log('Import complete:', result);

        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);

        if (onImportComplete) {
          onImportComplete();
        }
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Fehler beim Importieren der Datei');
      setIsProcessing(false);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleConfirmUpdates = (applyUpdates: boolean) => {
    const result = mergeBookings(pendingBookings, applyUpdates);
    console.log('Import complete:', result);

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);

    if (onImportComplete) {
      onImportComplete();
    }

    setPendingUpdates([]);
    setPendingBookings([]);
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xls,.xlsx"
        onChange={handleFileSelect}
        className="hidden"
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isProcessing}
        className="relative w-12 h-12 rounded-full bg-primary-500 hover:bg-primary-600 active:bg-primary-700 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
        title="Buchungen importieren"
      >
        {showSuccess ? (
          <CheckCircle className="w-6 h-6 text-white" />
        ) : isProcessing ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Upload className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        )}
      </button>

      {pendingUpdates.length > 0 && (
        <UpdateConfirmDialog
          updates={pendingUpdates}
          onConfirm={handleConfirmUpdates}
        />
      )}
    </>
  );
}
