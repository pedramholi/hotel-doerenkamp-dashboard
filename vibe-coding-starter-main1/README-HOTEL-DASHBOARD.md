# Hotel Doerenkamp Dashboard

## Overview
A glassmorphism-styled dashboard for Hotel Doerenkamp in Düsseldorf, Germany, displaying real-time hotel performance metrics from Booking.com data.

## Current Features

### Dashboard Metrics (Based on Real Data: Jan 1-10, 2026)
- **Total Revenue**: €5,547 (78 bookings)
- **Total Guests**: 159 guests
- **Room Nights**: 129 nights booked
- **Average Daily Rate**: €43.00
- **Occupancy Rate**: 47.8% (129 of 270 available room nights)
- **Commission**: €661.19 (12% to Booking.com)

### Visual Components
1. **Daily Revenue Chart** - Shows revenue trends with diagonal hatch pattern on peak day
2. **Performance Metrics Card** - ADR, avg stay length, net revenue
3. **Occupancy Gauge** - Visual representation of room utilization
4. **Top Performing Rooms** - DO#17, DO#24 revenue leaders

## Data Source
The dashboard currently uses data from:
- **File**: `Anreise 2026-01-01 bis 2026-01-10.xls`
- **Period**: January 1-10, 2026
- **Bookings**: 80 total (78 active, 2 cancelled)

### Supported File Formats
✓ **CSV (.csv)** - Recommended, works immediately, no extra dependencies
✓ **Excel (.xls, .xlsx)** - Requires `npm install xlsx`

Both formats are automatically detected and parsed correctly.

## Technical Implementation

### Data Parsers

**1. Booking.com Parser** (`lib/bookingcom-parser.ts`)
- Parses German column names from Booking.com exports
- Converts EUR prices, dates, and calculates metrics
- Supports both CSV and Excel formats

**2. Universal CSV/Excel Parser** (`lib/csv-parser.ts`)
- Handles .csv files natively (no dependencies)
- Supports .xls/.xlsx with optional xlsx library
- Auto-detects file format and processes accordingly

### Booking.com Column Mapping
German columns automatically parsed:
- **Buchungsnummer** → Booking Number
- **Gästename(n)** → Guest Name
- **Anreise / Abreise** → Check-in / Check-out
- **Preis** → Revenue (converts "62.7 EUR" → 62.7)
- **Kommission %** → Commission Rate
- **Kommissionsbetrag** → Commission Amount
- **Art der Wohneinheit** → Room Type (DO#12, DO#17, etc.)
- **Aufenthaltsdauer (Nächte)** → Number of Nights
- **Status** → Booking Status
- **Stornierungsdatum** → Cancellation Date

### Key Files
```
/data
  ├── hotel-dashboard-data.ts   # Hotel-specific dashboard data
  └── sample-bookings.json       # Sample booking records

/lib
  └── bookingcom-parser.ts       # Booking.com data parser

/components/dashboard
  ├── GlassNav.tsx              # Top navigation
  ├── StatCards.tsx             # Metric cards (updated with hotel icons)
  ├── AverageSalesChart.tsx     # Revenue chart
  ├── FormationStatus.tsx       # Performance metrics
  ├── SuccessRate.tsx           # Occupancy gauge
  └── RecentEmails.tsx          # Top rooms list
```

## Next Steps: CSV Import Feature

To enable live CSV import functionality:

### 1. Install Additional Dependencies
```bash
npm install papaparse xlsx
npm install --save-dev @types/papaparse
```

### 2. Create Upload Component
The upload component will:
- Accept .xls, .xlsx, and .csv files
- Parse Booking.com exports automatically
- Update dashboard metrics in real-time
- Store parsed data in local state or database

### 3. Usage
Once implemented:
1. Export bookings from Booking.com extranet
2. Click "Import Data" button on dashboard
3. Select the exported file
4. Dashboard updates automatically with new metrics

## Room Types at Hotel Doerenkamp
Based on the data, the hotel has 27 rooms identified as:
- DO#12, DO#17, DO#18, DO#23, DO#24, DO#25, DO#27, etc.
- Each represents a room or unit type

## Development

### Running the Dashboard
```bash
npm run dev
```
Access at: http://localhost:6006/dashboard

### Data Structure
The parser converts Booking.com rows to standardized format:
```typescript
interface Booking {
  bookingNumber: number;
  guestName: string;
  checkIn: Date;
  checkOut: Date;
  revenue: number;
  commission: number;
  country: string;
  unitType: string; // Room type
  nights: number;
  isCancelled: boolean;
}
```

### Calculating Metrics
```typescript
import { parseBookingComData } from '@/lib/bookingcom-parser';

const { bookings, metrics } = parseBookingComData(rawData, 27); // 27 = total rooms
```

## Design Features
- ✨ Glassmorphism with frosted surfaces
- 🎨 Violet & sky blue color palette
- 🌓 Full dark mode support
- 📱 Responsive design (mobile to desktop)
- 📊 Diagonal hatch patterns on active elements
- 🇩🇪 German hotel branding

## Future Enhancements
- [ ] Live CSV/Excel file upload
- [ ] Date range filtering
- [ ] Multi-channel comparison (Booking.com vs Airbnb vs direct)
- [ ] Guest analytics (countries, purposes, repeat guests)
- [ ] Revenue forecasting
- [ ] Automated email reports
- [ ] Integration with PMS (Property Management System)
