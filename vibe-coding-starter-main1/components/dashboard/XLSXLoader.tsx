'use client';

import { useEffect, useState } from 'react';

/**
 * Loads XLSX library into browser window
 */
export function XLSXLoader() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Check if already loaded
    if (typeof window !== 'undefined' && (window as Window & { XLSX?: unknown }).XLSX) {
      setLoaded(true);
      return;
    }

    // Load XLSX
    import('xlsx').then((XLSX) => {
      (window as Window & { XLSX?: unknown }).XLSX = XLSX;
      setLoaded(true);
      console.log('✓ XLSX library loaded');
    }).catch((error) => {
      console.error('Failed to load XLSX:', error);
    });
  }, []);

  return null; // This component doesn't render anything
}
