/**
 * Dynamic Dashboard Data Generator
 * Generates dashboard data from localStorage bookings
 */

import { getAllBookings } from './booking-storage';
import { parseBookingRow, calculateMetrics, type Booking } from './bookingcom-parser';
import { calculateEnhancedMetrics } from './enhanced-metrics';

export type DateRangeType = '7' | '30' | '90' | 'all';

/**
 * Filter bookings by date range
 */
function filterBookingsByDateRange(bookings: Booking[], dateRange: DateRangeType): Booking[] {
  if (dateRange === 'all') return bookings;

  const days = parseInt(dateRange);
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  cutoffDate.setHours(0, 0, 0, 0);

  return bookings.filter(booking => {
    const bookingDate = booking.checkIn;
    return bookingDate >= cutoffDate;
  });
}

/**
 * Generate 7-day sparkline data for a metric
 */
function generate7DaySparkline(
  bookings: Booking[],
  metricGetter: (bookings: Booking[]) => number
): number[] {
  const sparklineData: number[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 6; i >= 0; i--) {
    const dayStart = new Date(today);
    dayStart.setDate(dayStart.getDate() - i);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const dayBookings = bookings.filter(booking => {
      const checkIn = booking.checkIn;
      return checkIn >= dayStart && checkIn < dayEnd;
    });

    sparklineData.push(metricGetter(dayBookings));
  }

  return sparklineData;
}

/**
 * Calculate trend by comparing current period with previous period
 */
function calculateTrend(
  currentValue: number,
  bookings: Booking[],
  dateRange: DateRangeType,
  metricGetter: (bookings: Booking[]) => number
): { trend: string; direction: 'up' | 'down' | 'neutral' } {
  if (dateRange === 'all' || currentValue === 0) {
    return { trend: '—', direction: 'neutral' };
  }

  const days = parseInt(dateRange);
  const now = new Date();
  const currentStart = new Date(now);
  currentStart.setDate(currentStart.getDate() - days);
  currentStart.setHours(0, 0, 0, 0);

  const previousStart = new Date(currentStart);
  previousStart.setDate(previousStart.getDate() - days);
  const previousEnd = new Date(currentStart);
  previousEnd.setDate(previousEnd.getDate() - 1);

  // Filter bookings for previous period
  const previousBookings = bookings.filter(booking => {
    const bookingDate = booking.checkIn;
    return bookingDate >= previousStart && bookingDate <= previousEnd;
  });

  if (previousBookings.length === 0) {
    return { trend: '—', direction: 'neutral' };
  }

  const previousValue = metricGetter(previousBookings);

  if (previousValue === 0) {
    return currentValue > 0
      ? { trend: '+100%', direction: 'up' }
      : { trend: '—', direction: 'neutral' };
  }

  const percentageChange = ((currentValue - previousValue) / previousValue) * 100;
  const direction = percentageChange > 0 ? 'up' : percentageChange < 0 ? 'down' : 'neutral';
  const sign = percentageChange > 0 ? '+' : '';

  return {
    trend: `${sign}${percentageChange.toFixed(1)}%`,
    direction
  };
}

export function generateDashboardData(dateRange: DateRangeType = 'all') {
  // Get bookings from localStorage
  const storedBookings = getAllBookings();

  // If no bookings, return default/empty data
  if (storedBookings.length === 0) {
    return {
      hotelName: 'Hotel Doerenkamp',
      location: 'Düsseldorf, Germany',
      totalRooms: 27,
      greeting: 'Guten Morgen!',
      stats: [
        {
          icon: 'euro',
          value: '€0',
          label: 'Total Revenue',
          hasOverflowMenu: true,
          trend: '+0%',
        },
        {
          icon: 'bed',
          value: '0',
          label: 'Total Bookings',
          hasOverflowMenu: false,
          trend: '+0%',
        },
        {
          icon: 'users',
          value: '0',
          label: 'Total Guests',
          hasOverflowMenu: false,
          trend: '+0%',
        },
        {
          icon: 'calendar',
          value: '0',
          label: 'Room Nights Booked',
          hasOverflowMenu: false,
          trend: '+0%',
        },
      ],
      revenueChart: {
        title: 'Daily Revenue',
        subtitle: 'Booking.com channel performance',
        metrics: [
          {
            label: 'Gross Revenue',
            value: '€0',
            delta: '+0%',
            tone: 'success' as const,
          },
          {
            label: 'Commission (12%)',
            value: '€0',
            delta: '-0%',
            tone: 'danger' as const,
          },
        ],
        data: [],
        activeMonth: '',
        tooltipData: [],
      },
      performance: {
        title: 'Performance Metrics',
        subtitle: 'Keine Daten verfügbar',
        progress: 0,
        metrics: [
          { label: 'Average Daily Rate', value: '€0' },
          { label: 'Avg Stay Length', value: '0 nights' },
          { label: 'Net Revenue', value: '€0' },
          { label: 'Cancelled Bookings', value: '0' },
        ],
      },
      occupancyRate: {
        title: 'Occupancy Rate',
        subtitle: 'Room utilization overview',
        value: 0,
        supportingText: 'Keine Buchungsdaten verfügbar',
        miniStats: [
          { label: 'Room Nights', value: '0' },
          { label: 'Avg Guests', value: '0' },
        ],
      },
      topRooms: [],

      // Enhanced metrics (empty state)
      enhancedMetrics: {
        revPAR: 0,
        cancellationRate: 0,
        distributionCost: 0,
        futureOccupancy: 0,
        revenueByCountry: [],
      },
    };
  }

  // Parse bookings
  let bookings: Booking[] = storedBookings.map(parseBookingRow);

  // Filter by date range
  bookings = filterBookingsByDateRange(bookings, dateRange);

  // Calculate metrics
  const metrics = calculateMetrics(bookings, 27);

  // Calculate enhanced metrics
  const enhancedMetrics = calculateEnhancedMetrics(
    bookings,
    metrics.totalRevenue,
    metrics.commissionTotal,
    metrics.cancelledBookings,
    27
  );

  // Format currency
  const formatEuro = (amount: number) =>
    `€${amount.toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  const formatEuroDecimal = (amount: number) =>
    `€${amount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Get date range based on check-in dates
  const activeBookings = bookings.filter(b => !b.isCancelled);
  const checkInDates = activeBookings.map(b => b.checkIn);
  const minDate = checkInDates.length > 0 ? new Date(Math.min(...checkInDates.map((d) => d.getTime()))) : new Date();
  // Use the latest check-out date as the end of the range
  const checkOutDates = activeBookings.map(b => b.checkOut);
  const maxDate = checkOutDates.length > 0 ? new Date(Math.max(...checkOutDates.map((d) => d.getTime()))) : minDate;

  const formatDate = (date: Date) => {
    const month = date.toLocaleString('de-DE', { month: 'short' });
    const day = date.getDate();
    return `${day}. ${month}`;
  };

  const dateRangeLabel = `${formatDate(minDate)} - ${formatDate(maxDate)}`;

  // Top 10 revenue days
  const topRevenueDays = [...metrics.revenueByDate]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10)
    .map((item) => {
      const date = new Date(item.date);
      const monthDay = `${date.toLocaleString('de-DE', { month: 'short' })} ${date.getDate()}`;
      return {
        month: monthDay,
        value: Math.round(item.revenue),
      };
    });

  // Top performing rooms
  const topRooms = [...metrics.revenueByRoom]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
    .map((item, index) => ({
      id: (index + 1).toString(),
      name: item.room,
      avatar: `${index + 1}`,
      subject: `${item.bookings} Buchungen`,
      invited: formatEuro(item.revenue),
      status: index === 0 ? 'Top Performer' : index === 1 ? 'High Demand' : 'Popular',
      time: `${item.bookings}x`,
    }));

  const netRevenue = metrics.totalRevenue - metrics.commissionTotal;
  const activeMonthLabel = topRevenueDays.length > 0 ? topRevenueDays[0].month : '';
  const activeMonthRevenue = topRevenueDays.length > 0 ? topRevenueDays[0].value : 0;
  const activeMonthBookings =
    metrics.revenueByDate.find((d) => {
      const date = new Date(d.date);
      const monthDay = `${date.toLocaleString('de-DE', { month: 'short' })} ${date.getDate()}`;
      return monthDay === activeMonthLabel;
    })?.bookings || 0;

  // Calculate trends comparing current period with previous period
  const allParsedBookings = storedBookings.map(parseBookingRow);
  const revenueTrend = calculateTrend(
    metrics.totalRevenue,
    allParsedBookings,
    dateRange,
    (bookings) => {
      const filtered = filterBookingsByDateRange(bookings, dateRange);
      return calculateMetrics(filtered, 27).totalRevenue;
    }
  );

  const bookingsTrend = calculateTrend(
    metrics.totalBookings,
    allParsedBookings,
    dateRange,
    (bookings) => {
      const filtered = filterBookingsByDateRange(bookings, dateRange);
      return calculateMetrics(filtered, 27).totalBookings;
    }
  );

  const guestsTrend = calculateTrend(
    metrics.totalGuests,
    allParsedBookings,
    dateRange,
    (bookings) => {
      const filtered = filterBookingsByDateRange(bookings, dateRange);
      return calculateMetrics(filtered, 27).totalGuests;
    }
  );

  const nightsTrend = calculateTrend(
    metrics.totalNights,
    allParsedBookings,
    dateRange,
    (bookings) => {
      const filtered = filterBookingsByDateRange(bookings, dateRange);
      return calculateMetrics(filtered, 27).totalNights;
    }
  );

  // Get comparison period label
  const getComparisonLabel = (dateRange: DateRangeType) => {
    if (dateRange === 'all') return '';
    const days = parseInt(dateRange);
    return `vs. vorherige ${days} Tage`;
  };

  const comparisonLabel = getComparisonLabel(dateRange);

  // Generate 7-day sparkline data for each metric
  const revenueSparkline = generate7DaySparkline(allParsedBookings, (bookings) => {
    if (bookings.length === 0) return 0;
    return calculateMetrics(bookings, 27).totalRevenue;
  });

  const bookingsSparkline = generate7DaySparkline(allParsedBookings, (bookings) => {
    if (bookings.length === 0) return 0;
    return calculateMetrics(bookings, 27).totalBookings;
  });

  const guestsSparkline = generate7DaySparkline(allParsedBookings, (bookings) => {
    if (bookings.length === 0) return 0;
    return calculateMetrics(bookings, 27).totalGuests;
  });

  const nightsSparkline = generate7DaySparkline(allParsedBookings, (bookings) => {
    if (bookings.length === 0) return 0;
    return calculateMetrics(bookings, 27).totalNights;
  });

  return {
    hotelName: 'Hotel Doerenkamp',
    location: 'Düsseldorf, Germany',
    totalRooms: 27,
    greeting: 'Guten Morgen!',

    stats: [
      {
        icon: 'euro',
        value: formatEuro(metrics.totalRevenue),
        label: `Total Revenue${comparisonLabel ? ` (${comparisonLabel})` : ''}`,
        hasOverflowMenu: true,
        trend: revenueTrend.trend,
        sparklineData: revenueSparkline,
      },
      {
        icon: 'bed',
        value: metrics.totalBookings.toString(),
        label: `Total Bookings${comparisonLabel ? ` (${comparisonLabel})` : ''}`,
        hasOverflowMenu: false,
        trend: bookingsTrend.trend,
        sparklineData: bookingsSparkline,
      },
      {
        icon: 'users',
        value: metrics.totalGuests.toString(),
        label: `Total Guests${comparisonLabel ? ` (${comparisonLabel})` : ''}`,
        hasOverflowMenu: false,
        trend: guestsTrend.trend,
        sparklineData: guestsSparkline,
      },
      {
        icon: 'calendar',
        value: metrics.totalNights.toString(),
        label: `Room Nights${comparisonLabel ? ` (${comparisonLabel})` : ''}`,
        hasOverflowMenu: false,
        trend: nightsTrend.trend,
        sparklineData: nightsSparkline,
      },
    ],

    revenueChart: {
      title: 'Daily Revenue',
      subtitle: `Booking.com channel performance (Top 10 Tage)`,
      metrics: [
        {
          label: 'Gross Revenue',
          value: formatEuroDecimal(metrics.totalRevenue),
          delta: revenueTrend.trend,
          tone: revenueTrend.direction === 'up' ? 'success' as const : revenueTrend.direction === 'down' ? 'danger' as const : 'neutral' as const,
        },
        {
          label: `Commission (${Math.round((metrics.commissionTotal / metrics.totalRevenue) * 100)}%)`,
          value: formatEuroDecimal(metrics.commissionTotal),
          delta: revenueTrend.trend, // Commission trend follows revenue trend
          tone: 'danger' as const,
        },
      ],
      data: topRevenueDays,
      activeMonth: activeMonthLabel,
      tooltipData: [
        { label: formatEuroDecimal(activeMonthRevenue), color: 'primary-400' },
        { label: `${activeMonthBookings} bookings`, color: 'primary-700' },
      ],
    },

    performance: {
      title: 'Performance Metrics',
      subtitle: dateRangeLabel,
      progress: 0.65,
      metrics: [
        {
          label: 'Average Daily Rate',
          value: formatEuroDecimal(metrics.averageDailyRate),
        },
        {
          label: 'Avg Stay Length',
          value: `${metrics.averageStayLength.toFixed(2)} nights`,
        },
        { label: 'Net Revenue', value: formatEuroDecimal(netRevenue) },
        {
          label: 'Cancelled Bookings',
          value: metrics.cancelledBookings.toString(),
        },
      ],
    },

    occupancyRate: {
      title: 'Occupancy Rate',
      subtitle: 'Room utilization overview',
      value: metrics.occupancyRate / 100, // Convert to decimal (e.g., 0.462 for 46.2%)
      supportingText: `Based on ${metrics.totalNights} room nights across ${dateRangeLabel}`,
      miniStats: [
        { label: 'Room Nights', value: metrics.totalNights.toString() },
        {
          label: 'Avg Guests',
          value: (metrics.totalGuests / metrics.totalBookings).toFixed(1),
        },
      ],
    },

    topRooms,

    // Enhanced metrics
    enhancedMetrics: {
      revPAR: enhancedMetrics.revPAR,
      cancellationRate: enhancedMetrics.cancellationRate,
      distributionCost: enhancedMetrics.distributionCost,
      futureOccupancy: enhancedMetrics.futureOccupancy,
      revenueByCountry: enhancedMetrics.revenueByCountry,
    },
  };
}
