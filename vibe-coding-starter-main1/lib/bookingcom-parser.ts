/**
 * Booking.com Data Parser
 * Parses Excel/CSV exports from Booking.com for Hotel Doerenkamp
 */

export interface BookingComRow {
  Buchungsnummer: number;
  'Gebucht von': string;
  'Gästename(n) ': string;
  Anreise: string;
  Abreise: string;
  'Gebucht am': string;
  Status: string;
  Zimmer: number;
  Personen: number;
  Erwachsene: number;
  Kinder: number;
  'Alter der Kinder': string | null;
  Preis: string;
  'Kommission %': number;
  Kommissionsbetrag: string;
  Zahlungsstatus: string;
  'Zahlungsmethode (Zahlungsanbieter)': string | null;
  Bemerkungen: string | null;
  Buchergruppe: string | null;
  'Booker country': string;
  Reisegrund: string;
  Gerät: string | null;
  'Art der Wohneinheit': string;
  'Aufenthaltsdauer (Nächte)': number;
  Stornierungsdatum: string | null;
  Adresse: string;
  Telefonnummer: string | null;
}

export interface Booking {
  bookingNumber: number;
  guestName: string;
  checkIn: Date;
  checkOut: Date;
  bookedOn: Date;
  status: string;
  rooms: number;
  guests: number;
  adults: number;
  children: number;
  revenue: number;
  commission: number;
  commissionRate: number;
  paymentStatus: string;
  country: string;
  purpose: string;
  unitType: string;
  nights: number;
  isCancelled: boolean;
  cancelledOn: Date | null;
}

export interface HotelMetrics {
  totalRevenue: number;
  totalBookings: number;
  totalNights: number;
  totalGuests: number;
  averageDailyRate: number;
  occupancyRate: number;
  averageStayLength: number;
  commissionTotal: number;
  cancelledBookings: number;
  cancelledRevenue: number;
  revenueByDate: Array<{ date: string; revenue: number; bookings: number }>;
  revenueByRoom: Array<{ room: string; revenue: number; bookings: number }>;
  bookingsByCountry: Array<{ country: string; count: number }>;
}

/**
 * Parse EUR price string to number
 */
export function parseEuroPrice(priceStr: string): number {
  if (!priceStr) return 0;
  // "62.7 EUR" -> 62.7
  return parseFloat(priceStr.replace(' EUR', '').replace(',', '.'));
}

/**
 * Parse date string from Booking.com format
 */
export function parseBookingDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  // "2026-01-01" or "2025-12-20 21:24:08"
  return new Date(dateStr);
}

/**
 * Convert raw Booking.com row to standardized Booking object
 */
export function parseBookingRow(row: BookingComRow): Booking {
  return {
    bookingNumber: row.Buchungsnummer,
    guestName: row['Gästename(n) '].trim(),
    checkIn: parseBookingDate(row.Anreise),
    checkOut: parseBookingDate(row.Abreise),
    bookedOn: parseBookingDate(row['Gebucht am']),
    status: row.Status,
    rooms: row.Zimmer,
    guests: row.Personen,
    adults: row.Erwachsene,
    children: row.Kinder,
    revenue: parseEuroPrice(row.Preis),
    commission: parseEuroPrice(row.Kommissionsbetrag),
    commissionRate: row['Kommission %'],
    paymentStatus: row.Zahlungsstatus,
    country: row['Booker country'] || 'unknown',
    purpose: row.Reisegrund || 'unknown',
    unitType: row['Art der Wohneinheit'] || 'unknown',
    nights: row['Aufenthaltsdauer (Nächte)'],
    isCancelled: !!row.Stornierungsdatum,
    cancelledOn: row.Stornierungsdatum
      ? parseBookingDate(row.Stornierungsdatum)
      : null,
  };
}

/**
 * Calculate hotel metrics from bookings
 */
export function calculateMetrics(
  bookings: Booking[],
  totalRooms: number = 27,
): HotelMetrics {
  const activeBookings = bookings.filter((b) => !b.isCancelled);
  const cancelledBookings = bookings.filter((b) => b.isCancelled);

  const totalRevenue = activeBookings.reduce((sum, b) => sum + b.revenue, 0);
  const totalNights = activeBookings.reduce((sum, b) => sum + b.nights, 0);
  const totalGuests = activeBookings.reduce((sum, b) => sum + b.guests, 0);
  const commissionTotal = activeBookings.reduce(
    (sum, b) => sum + b.commission,
    0,
  );
  const cancelledRevenue = cancelledBookings.reduce(
    (sum, b) => sum + b.revenue,
    0,
  );

  const averageDailyRate = totalNights > 0 ? totalRevenue / totalNights : 0;
  const averageStayLength =
    activeBookings.length > 0 ? totalNights / activeBookings.length : 0;

  // Calculate occupancy rate (assuming date range from data)
  const dates = activeBookings.map((b) => b.checkIn);
  const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
  const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));
  const totalDays =
    Math.ceil(
      (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24),
    ) + 1;
  const totalRoomNights = totalRooms * totalDays;
  const occupancyRate =
    totalRoomNights > 0 ? (totalNights / totalRoomNights) * 100 : 0;

  // Revenue by date
  const revenueByDateMap = new Map<string, { revenue: number; bookings: number }>();
  activeBookings.forEach((b) => {
    const dateKey = b.checkIn.toISOString().split('T')[0];
    const existing = revenueByDateMap.get(dateKey) || { revenue: 0, bookings: 0 };
    revenueByDateMap.set(dateKey, {
      revenue: existing.revenue + b.revenue,
      bookings: existing.bookings + 1,
    });
  });
  const revenueByDate = Array.from(revenueByDateMap.entries())
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Revenue by room type
  const revenueByRoomMap = new Map<string, { revenue: number; bookings: number }>();
  activeBookings.forEach((b) => {
    const existing = revenueByRoomMap.get(b.unitType) || { revenue: 0, bookings: 0 };
    revenueByRoomMap.set(b.unitType, {
      revenue: existing.revenue + b.revenue,
      bookings: existing.bookings + 1,
    });
  });
  const revenueByRoom = Array.from(revenueByRoomMap.entries()).map(
    ([room, data]) => ({ room, ...data }),
  );

  // Bookings by country
  const countryMap = new Map<string, number>();
  activeBookings.forEach((b) => {
    countryMap.set(b.country, (countryMap.get(b.country) || 0) + 1);
  });
  const bookingsByCountry = Array.from(countryMap.entries())
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalRevenue,
    totalBookings: activeBookings.length,
    totalNights,
    totalGuests,
    averageDailyRate,
    occupancyRate,
    averageStayLength,
    commissionTotal,
    cancelledBookings: cancelledBookings.length,
    cancelledRevenue,
    revenueByDate,
    revenueByRoom,
    bookingsByCountry,
  };
}

/**
 * Parse entire Booking.com dataset
 */
export function parseBookingComData(
  data: BookingComRow[],
  totalRooms: number = 27,
): { bookings: Booking[]; metrics: HotelMetrics } {
  const bookings = data.map(parseBookingRow);
  const metrics = calculateMetrics(bookings, totalRooms);

  return { bookings, metrics };
}
