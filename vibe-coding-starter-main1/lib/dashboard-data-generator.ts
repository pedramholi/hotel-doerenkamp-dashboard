/**
 * Dynamic Dashboard Data Generator
 * Generates dashboard data from localStorage bookings
 */

import { getAllBookings } from './booking-storage';
import { parseBookingRow, calculateMetrics, type Booking } from './bookingcom-parser';
import { calculateEnhancedMetrics } from './enhanced-metrics';

export function generateDashboardData() {
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
  const bookings: Booking[] = storedBookings.map(parseBookingRow);

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
      from: item.room,
      subject: `${item.bookings} Buchungen`,
      preview: formatEuro(item.revenue),
      time: index === 0 ? 'Top Performer' : index === 1 ? 'High Demand' : 'Popular',
      starred: index < 3,
      hasAttachment: false,
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

  return {
    hotelName: 'Hotel Doerenkamp',
    location: 'Düsseldorf, Germany',
    totalRooms: 27,
    greeting: 'Guten Morgen!',

    stats: [
      {
        icon: 'euro',
        value: formatEuro(metrics.totalRevenue),
        label: `Total Revenue (${dateRangeLabel})`,
        hasOverflowMenu: true,
        trend: '+18.5%',
      },
      {
        icon: 'bed',
        value: metrics.totalBookings.toString(),
        label: 'Total Bookings',
        hasOverflowMenu: false,
        trend: '+15.2%',
      },
      {
        icon: 'users',
        value: metrics.totalGuests.toString(),
        label: 'Total Guests',
        hasOverflowMenu: false,
        trend: '+12.8%',
      },
      {
        icon: 'calendar',
        value: metrics.totalNights.toString(),
        label: 'Room Nights Booked',
        hasOverflowMenu: false,
        trend: '+14.5%',
      },
    ],

    revenueChart: {
      title: 'Daily Revenue',
      subtitle: `Booking.com channel performance (Top 10 Tage)`,
      metrics: [
        {
          label: 'Gross Revenue',
          value: formatEuroDecimal(metrics.totalRevenue),
          delta: '+18.5%',
          tone: 'success' as const,
        },
        {
          label: `Commission (${Math.round((metrics.commissionTotal / metrics.totalRevenue) * 100)}%)`,
          value: formatEuroDecimal(metrics.commissionTotal),
          delta: '-12%',
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
