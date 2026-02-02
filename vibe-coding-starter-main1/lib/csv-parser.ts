/**
 * Universal CSV/Excel Parser for Booking.com Data
 * Handles both .csv and .xls/.xlsx formats
 */

import { BookingComRow, parseBookingComData } from './bookingcom-parser';

/**
 * Parse CSV string to array of objects
 */
export function parseCSV(csvContent: string): BookingComRow[] {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) return [];

  // Get headers
  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));

  // Parse rows
  const rows: BookingComRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: any = {};

    headers.forEach((header, index) => {
      let value: any = values[index]?.trim().replace(/^"|"$/g, '') || '';

      // Convert numeric fields
      if (
        [
          'Buchungsnummer',
          'Zimmer',
          'Personen',
          'Erwachsene',
          'Kinder',
          'Kommission %',
          'Aufenthaltsdauer (Nächte)',
        ].includes(header)
      ) {
        value = value ? parseInt(value, 10) : 0;
      }

      // Handle null/empty values
      if (value === '' || value === 'NaN' || value === null) {
        value = null;
      }

      row[header] = value;
    });

    rows.push(row as BookingComRow);
  }

  return rows;
}

/**
 * Parse a single CSV line (handles quoted commas)
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);

  return result;
}

/**
 * Client-side file parser for browser uploads
 * Supports: .csv, .xls, .xlsx
 */
export async function parseBookingFile(
  file: File,
): Promise<{ bookings: any[]; metrics: any } | null> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  try {
    if (extension === 'csv') {
      // Parse CSV
      const text = await file.text();
      const rows = parseCSV(text);
      return parseBookingComData(rows, 27);
    } else if (extension === 'xls' || extension === 'xlsx') {
      // For Excel files, we need the xlsx library
      // This is a placeholder - will work after installing xlsx
      console.warn(
        'Excel parsing requires "xlsx" library. Install with: npm install xlsx',
      );

      // Attempt to parse if xlsx is available
      if (typeof window !== 'undefined' && (window as any).XLSX) {
        const XLSX = (window as any).XLSX;
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        return parseBookingComData(jsonData as BookingComRow[], 27);
      }

      return null;
    } else {
      throw new Error('Unsupported file format. Use .csv, .xls, or .xlsx');
    }
  } catch (error) {
    console.error('Error parsing file:', error);
    return null;
  }
}

/**
 * Server-side file parser for Node.js
 * Use this in API routes or server components
 */
export async function parseBookingFileServer(
  filePath: string,
): Promise<{ bookings: any[]; metrics: any }> {
  const fs = await import('fs');
  const path = await import('path');

  const extension = path.extname(filePath).toLowerCase();

  if (extension === '.csv') {
    const content = fs.readFileSync(filePath, 'utf-8');
    const rows = parseCSV(content);
    return parseBookingComData(rows, 27);
  } else if (extension === '.xls' || extension === '.xlsx') {
    // Use xlsx in Node.js
    try {
      const XLSX = await import('xlsx');
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      return parseBookingComData(jsonData as BookingComRow[], 27);
    } catch (error) {
      throw new Error(
        'xlsx library not installed. Run: npm install xlsx',
      );
    }
  } else {
    throw new Error('Unsupported file format');
  }
}

/**
 * Example usage:
 *
 * // In browser (with file input):
 * const result = await parseBookingFile(file);
 * if (result) {
 *   console.log('Metrics:', result.metrics);
 *   console.log('Bookings:', result.bookings);
 * }
 *
 * // On server:
 * const result = await parseBookingFileServer('/path/to/file.xls');
 */
