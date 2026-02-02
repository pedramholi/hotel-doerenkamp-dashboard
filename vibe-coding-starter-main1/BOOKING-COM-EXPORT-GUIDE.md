# Booking.com Export Guide for Hotel Doerenkamp

## How to Export Your Booking Data

### Option 1: Export as CSV (Recommended ✓)
1. Log into your Booking.com Extranet
2. Go to **Reservations** → **All Reservations**
3. Set your date filter (e.g., "Anreise 2026-01-01 bis 2026-01-10")
4. Click **Export** or **Download**
5. Choose **CSV format**
6. Save the file

**Advantages:**
- Works immediately with the dashboard
- No additional dependencies needed
- Faster to process
- Compatible with all spreadsheet software

### Option 2: Export as Excel (.xls or .xlsx)
1. Follow steps 1-4 above
2. Choose **Excel format** (.xls or .xlsx)
3. Save the file

**Note:** Requires running `npm install xlsx` for processing

## Required Columns

The export must include these German columns (standard Booking.com format):

| German Column | English | Required |
|---------------|---------|----------|
| Buchungsnummer | Booking Number | ✓ |
| Gästename(n) | Guest Name | ✓ |
| Anreise | Check-in | ✓ |
| Abreise | Check-out | ✓ |
| Preis | Price | ✓ |
| Kommission % | Commission % | ✓ |
| Kommissionsbetrag | Commission Amount | ✓ |
| Status | Status | ✓ |
| Art der Wohneinheit | Room Type | ✓ |
| Aufenthaltsdauer (Nächte) | Nights | ✓ |
| Personen | Guests | ✓ |
| Stornierungsdatum | Cancellation Date | Optional |

## Importing to Dashboard

### Method 1: Replace Dashboard Data File
```bash
# 1. Place your export in the project
cp ~/Downloads/Anreise\ 2026-01-01\ bis\ 2026-01-10.xls /path/to/project/data/

# 2. Run the Python parser (if Python is available)
python3 -c "
import pandas as pd
import json
df = pd.read_excel('data/your-file.xls')
# Process and update dashboard-data.ts
"
```

### Method 2: Use Upload Component (Coming Soon)
1. Navigate to the dashboard
2. Click "Import Data" in the upload component
3. Select your .csv or .xls file
4. Dashboard updates automatically

## File Naming Convention

Booking.com exports typically use:
```
Anreise YYYY-MM-DD bis YYYY-MM-DD.xls
```

Examples:
- `Anreise 2026-01-01 bis 2026-01-10.xls`
- `Anreise 2026-01-01 bis 2026-01-31.csv`
- `Anreise mit Kontaktdaten 2025-10-01 bis 2025-10-31.xls`

## Troubleshooting

### "Column not found" error
**Cause:** Export is missing required columns
**Solution:** Ensure you select "All columns" or at minimum the required columns when exporting

### "Invalid date format" error
**Cause:** Date format is not YYYY-MM-DD
**Solution:** Booking.com exports are standardized, but check your Excel regional settings

### "Price not recognized" error
**Cause:** Price format doesn't include "EUR"
**Solution:** Ensure prices show as "62.7 EUR" not just "62.7"

### Excel file won't parse
**Cause:** Missing xlsx library
**Solution:**
```bash
npm install xlsx
# or use CSV export instead
```

## Example Data Structure

### CSV Format:
```csv
Buchungsnummer,Gästename(n) ,Anreise,Abreise,Preis,Kommission %,Art der Wohneinheit
5596197551,Lenny Köhler,2026-01-01,2026-01-02,62.7 EUR,12,DO#12
6585744600,Guillien Gutierrez,2026-01-01,2026-01-02,65.7 EUR,12,DO#25
```

### Excel Format:
Same columns, just in .xls or .xlsx binary format

## Best Practices

1. **Export regularly** - Weekly or monthly for up-to-date metrics
2. **Use date ranges** - Match your reporting period
3. **Include cancelled bookings** - Important for analysis
4. **Keep raw files** - Store originals for audit trail
5. **Use CSV when possible** - Faster, lighter, no dependencies

## Multiple Files

To analyze multiple periods:

1. Export each period separately
2. Name files clearly (e.g., `Jan2026.csv`, `Feb2026.csv`)
3. Process individually or combine:

```python
import pandas as pd

# Combine multiple exports
df1 = pd.read_csv('Jan2026.csv')
df2 = pd.read_csv('Feb2026.csv')
combined = pd.concat([df1, df2])
```

## Questions?

Check the dashboard documentation: `README-HOTEL-DASHBOARD.md`
