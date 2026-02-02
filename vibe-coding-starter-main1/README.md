# 🏨 Hotel Doerenkamp Dashboard

A beautiful glassmorphism-styled dashboard for **Hotel Doerenkamp** in Düsseldorf, Germany. Visualize booking performance, revenue metrics, and occupancy rates from Booking.com exports.

![Next.js](https://img.shields.io/badge/Next.js-15.5-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- 📊 **Real-time Metrics** - Revenue, bookings, occupancy, ADR
- 📈 **Visual Analytics** - Interactive charts with diagonal hatch patterns
- 🌓 **Dark Mode** - Full light/dark theme support
- 📱 **Responsive** - Mobile-first design (320px to 4K)
- 🎨 **Glassmorphism UI** - Frosted glass effects with pastel gradients
- 📁 **CSV/Excel Import** - Parse Booking.com exports (.csv, .xls, .xlsx)
- 🇩🇪 **Multilingual** - German column names automatically parsed
- ⚡ **Fast** - Built with Next.js 15 and React 19

## 🖼️ Dashboard Preview

### Key Metrics
- Total Revenue & Bookings
- Guest Count & Room Nights
- Average Daily Rate (ADR)
- Occupancy Rate Visualization
- Commission Breakdown
- Top Performing Rooms

### Visualization Components
- **Daily Revenue Chart** - Bar chart with active day highlighting
- **Occupancy Gauge** - Circular segmented progress indicator
- **Performance Card** - Progress bars with diagonal hatch patterns
- **Room Rankings** - Top revenue-generating rooms

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/hotel-doerenkamp-dashboard.git
cd hotel-doerenkamp-dashboard

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:6006/dashboard](http://localhost:6006/dashboard)

### First Time Setup

1. **Export your Booking.com data:**
   - Log into Booking.com Extranet
   - Go to Reservations → Export
   - Choose CSV or Excel format
   - See [BOOKING-COM-EXPORT-GUIDE.md](BOOKING-COM-EXPORT-GUIDE.md) for detailed instructions

2. **Process your data:**
   ```bash
   # Place your export in the project
   cp ~/Downloads/Anreise*.xls ./data/

   # Update dashboard data (manual for now)
   # See README-HOTEL-DASHBOARD.md for processing instructions
   ```

3. **View your dashboard:**
   - Navigate to http://localhost:6006/dashboard
   - Toggle dark mode with the theme switch
   - Explore your hotel's performance metrics

## 📂 Project Structure

```
hotel-doerenkamp-dashboard/
├── app/
│   └── dashboard/
│       └── page.tsx              # Main dashboard page
├── components/
│   └── dashboard/
│       ├── GlassNav.tsx          # Top navigation bar
│       ├── StatCards.tsx         # Metric cards
│       ├── AverageSalesChart.tsx # Revenue chart
│       ├── FormationStatus.tsx   # Performance metrics
│       ├── SuccessRate.tsx       # Occupancy gauge
│       ├── RecentEmails.tsx      # Top rooms list
│       └── CSVUpload.tsx         # File import component
├── lib/
│   ├── bookingcom-parser.ts      # Booking.com data parser
│   └── csv-parser.ts             # CSV/Excel file handler
├── data/
│   ├── hotel-dashboard-data.ts   # Dashboard data structure
│   ├── sample-bookings.json      # Sample data
│   └── sample-bookings.csv       # Sample CSV
├── BOOKING-COM-EXPORT-GUIDE.md   # Export instructions
└── README-HOTEL-DASHBOARD.md     # Detailed documentation
```

## 🎨 Design System

### Colors
- **Primary**: Violet (#8B5CF6) - Main accent color
- **Secondary**: Sky Blue (#0EA5E9) - Supporting color
- **Glassmorphism**: Frosted white/dark surfaces with backdrop blur

### Typography
- **Font**: Inter (sans-serif)
- **Headings**: Bold, 700 weight
- **Body**: Medium, 500 weight
- **Numbers**: Tabular figures for alignment

## 📊 Data Processing

### Supported Formats
- ✅ CSV (.csv) - No dependencies required
- ✅ Excel (.xls, .xlsx) - Requires Python with pandas

### Column Mapping
German Booking.com columns are automatically parsed:

| German | English | Type |
|--------|---------|------|
| Buchungsnummer | Booking Number | number |
| Gästename(n) | Guest Name | string |
| Anreise | Check-in | date |
| Abreise | Check-out | date |
| Preis | Revenue | currency |
| Kommission % | Commission Rate | percentage |
| Art der Wohneinheit | Room Type | string |

### Calculated Metrics
- Total Revenue (€)
- Total Bookings
- Average Daily Rate (ADR)
- Occupancy Rate (%)
- Average Stay Length
- Commission Total
- Cancelled Bookings
- Revenue by Date
- Revenue by Room Type

## 🛠️ Configuration

### Hotel Settings
Update in `data/hotel-dashboard-data.ts`:

```typescript
export const hotelDashboardData = {
  hotelName: 'Hotel Doerenkamp',
  location: 'Düsseldorf, Germany',
  totalRooms: 27,
  // ... other settings
};
```

## 🔧 Development

### Available Scripts

```bash
npm run dev       # Start dev server (port 6006)
npm run build     # Build for production
npm start         # Start production server
npm run lint      # Run ESLint
npm run analyze   # Analyze bundle size
```

### Tech Stack
- **Framework**: Next.js 15.5 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 3.4
- **Components**: Radix UI primitives
- **Icons**: Lucide React
- **Type Safety**: TypeScript 5.9

## 🔒 Security & Privacy

⚠️ **Important:** This dashboard handles sensitive booking data.

- Real booking files (`.xls`, `.xlsx`, `.csv`) are excluded from git
- Only sample/demo data is included in the repository
- Never commit files containing guest personal information
- Use environment variables for API keys and sensitive config

## 📄 License

MIT License

## 📞 Support

For questions or issues:
- See [README-HOTEL-DASHBOARD.md](README-HOTEL-DASHBOARD.md) for detailed docs
- Check [BOOKING-COM-EXPORT-GUIDE.md](BOOKING-COM-EXPORT-GUIDE.md) for data export help

---

**Hotel Doerenkamp** | Düsseldorf, Germany 🇩🇪

Built with Next.js, Tailwind CSS, and TypeScript
