/**
 * Enhanced Hotel Metrics
 * Additional KPIs for hotel performance analysis
 */

import { Booking } from './bookingcom-parser';

export interface EnhancedMetrics {
  revPAR: number; // Revenue Per Available Room
  cancellationRate: number; // Percentage of cancelled bookings
  distributionCost: number; // Commission as percentage of revenue
  futureOccupancy: number; // Occupancy rate for future bookings
  revenueByCountry: Array<{ country: string; revenue: number; bookings: number }>;
}

/**
 * Calculate RevPAR (Revenue Per Available Room)
 * Formula: Total Revenue / (Total Rooms × Days in Period)
 */
export function calculateRevPAR(
  totalRevenue: number,
  totalRooms: number,
  daysInPeriod: number
): number {
  if (totalRooms === 0 || daysInPeriod === 0) return 0;
  return totalRevenue / (totalRooms * daysInPeriod);
}

/**
 * Calculate cancellation rate
 * Formula: (Cancelled Bookings / Total Bookings) × 100
 */
export function calculateCancellationRate(
  cancelledBookings: number,
  totalBookings: number
): number {
  if (totalBookings === 0) return 0;
  return (cancelledBookings / totalBookings) * 100;
}

/**
 * Calculate distribution cost (commission percentage)
 * Formula: (Total Commission / Total Revenue) × 100
 */
export function calculateDistributionCost(
  totalCommission: number,
  totalRevenue: number
): number {
  if (totalRevenue === 0) return 0;
  return (totalCommission / totalRevenue) * 100;
}

/**
 * Calculate future occupancy rate
 * Based on bookings with check-in date in the future
 */
export function calculateFutureOccupancy(
  bookings: Booking[],
  totalRooms: number,
  futureDays: number = 30
): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const futureDate = new Date(today);
  futureDate.setDate(futureDate.getDate() + futureDays);

  // Get bookings that check in within the next X days
  const futureBookings = bookings.filter((b) => {
    return !b.isCancelled && b.checkIn >= today && b.checkIn < futureDate;
  });

  // Calculate room nights for future period
  const futureNights = futureBookings.reduce((sum, b) => {
    // Only count nights that fall within our future period
    const nightsInPeriod = Math.min(
      b.nights,
      Math.ceil((futureDate.getTime() - b.checkIn.getTime()) / (1000 * 60 * 60 * 24))
    );
    return sum + Math.max(0, nightsInPeriod);
  }, 0);

  // Calculate occupancy rate
  const availableRoomNights = totalRooms * futureDays;
  if (availableRoomNights === 0) return 0;

  return (futureNights / availableRoomNights) * 100;
}

/**
 * Calculate revenue by country
 */
export function calculateRevenueByCountry(bookings: Booking[]): Array<{
  country: string;
  revenue: number;
  bookings: number;
}> {
  const activeBookings = bookings.filter((b) => !b.isCancelled);

  const countryMap = new Map<string, { revenue: number; bookings: number }>();

  for (const booking of activeBookings) {
    const country = booking.country || 'Unknown';
    const existing = countryMap.get(country) || { revenue: 0, bookings: 0 };

    countryMap.set(country, {
      revenue: existing.revenue + booking.revenue,
      bookings: existing.bookings + 1,
    });
  }

  return Array.from(countryMap.entries())
    .map(([country, data]) => ({
      country,
      revenue: data.revenue,
      bookings: data.bookings,
    }))
    .sort((a, b) => b.revenue - a.revenue);
}

/**
 * Get days in period from bookings
 */
export function getDaysInPeriod(bookings: Booking[]): number {
  const activeBookings = bookings.filter((b) => !b.isCancelled);

  if (activeBookings.length === 0) return 0;

  const checkInDates = activeBookings.map((b) => b.checkIn.getTime());
  const checkOutDates = activeBookings.map((b) => b.checkOut.getTime());

  const minDate = Math.min(...checkInDates);
  const maxDate = Math.max(...checkOutDates);

  const days = Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24));
  return days > 0 ? days : 1;
}

/**
 * Calculate all enhanced metrics at once
 */
export function calculateEnhancedMetrics(
  bookings: Booking[],
  totalRevenue: number,
  totalCommission: number,
  cancelledBookings: number,
  totalRooms: number = 27
): EnhancedMetrics {
  const daysInPeriod = getDaysInPeriod(bookings);
  const totalBookings = bookings.length;

  return {
    revPAR: calculateRevPAR(totalRevenue, totalRooms, daysInPeriod),
    cancellationRate: calculateCancellationRate(cancelledBookings, totalBookings),
    distributionCost: calculateDistributionCost(totalCommission, totalRevenue),
    futureOccupancy: calculateFutureOccupancy(bookings, totalRooms, 30),
    revenueByCountry: calculateRevenueByCountry(bookings),
  };
}
