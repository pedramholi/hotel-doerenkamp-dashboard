'use client';

import { Upload, FileSpreadsheet } from 'lucide-react';
import { useRef, useState } from 'react';

interface CSVUploadProps {
  onDataImported?: (data: any) => void;
}

export function CSVUpload({ onDataImported }: CSVUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase();

    // Validate file type
    if (!['csv', 'xls', 'xlsx'].includes(extension || '')) {
      alert('Please select a .csv, .xls, or .xlsx file');
      return;
    }

    setFileName(file.name);
    setIsProcessing(true);

    try {
      if (extension === 'csv') {
        // Parse CSV file
        const text = await file.text();
        const lines = text.split('\n');
        const bookingCount = lines.length - 1; // Subtract header

        setTimeout(() => {
          setIsProcessing(false);
          alert(
            `✓ CSV file processed!\n\n` +
              `File: ${file.name}\n` +
              `Bookings: ~${bookingCount}\n\n` +
              `The CSV parser is ready. To display metrics, connect to dashboard state.`
          );

          // Reset
          setFileName(null);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }, 1000);
      } else if (extension === 'xls' || extension === 'xlsx') {
        // Excel files need xlsx library
        setTimeout(() => {
          setIsProcessing(false);
          alert(
            `✓ Excel file uploaded!\n\n` +
              `File: ${file.name}\n` +
              `Format: ${extension.toUpperCase()}\n\n` +
              `To parse Excel files, install:\nnpm install xlsx\n\n` +
              `Or export from Booking.com as CSV format.`
          );

          // Reset
          setFileName(null);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }, 1000);
      }

      // Callback with parsed data
      if (onDataImported) {
        // onDataImported(parsedData);
      }
    } catch (error) {
      console.error('Error reading file:', error);
      setIsProcessing(false);
      alert('Error reading file. Please try again.');
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white/55 dark:bg-gray-900/55 backdrop-blur-sm border border-white/55 dark:border-white/8 rounded-3xl p-5 xl:p-6 shadow-lg dark:shadow-2xl">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base xl:text-lg font-bold text-gray-900 dark:text-gray-50 mb-1">
            Import Booking Data
          </h3>
          <p className="text-sm text-gray-900/52 dark:text-gray-50/55">
            Upload Booking.com Excel export
          </p>
        </div>
        <FileSpreadsheet className="w-6 h-6 text-primary-500" />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".xls,.xlsx,.csv"
        onChange={handleFileSelect}
        className="hidden"
      />

      <button
        onClick={handleClick}
        disabled={isProcessing}
        className="w-full h-12 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white rounded-full text-sm font-medium transition-colors flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            {fileName || 'Select File (.xls, .xlsx, .csv)'}
          </>
        )}
      </button>

      <div className="mt-4 space-y-2">
        <div className="text-xs text-gray-900/52 dark:text-gray-50/55">
          <strong>Supported formats:</strong>
        </div>
        <ul className="text-xs text-gray-900/52 dark:text-gray-50/55 space-y-1 pl-4">
          <li>• Excel (.xls, .xlsx) - Direct Booking.com export</li>
          <li>• CSV (.csv) - Comma-separated values</li>
        </ul>
      </div>

      <div className="mt-4 p-3 bg-primary-500/10 dark:bg-primary-500/5 rounded-xl border border-primary-500/20 dark:border-primary-500/10">
        <p className="text-xs text-gray-900/78 dark:text-gray-50/78">
          <strong>Note:</strong> To enable full CSV processing, install dependencies:
          <code className="block mt-1 bg-gray-900/10 dark:bg-white/10 px-2 py-1 rounded">
            npm install xlsx papaparse
          </code>
        </p>
      </div>
    </div>
  );
}
