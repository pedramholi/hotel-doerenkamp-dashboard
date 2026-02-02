/**
 * Hotel Doerenkamp Dashboard Data
 * Based on Booking.com exports
 */

export const hotelDashboardData = {
  hotelName: 'Hotel Doerenkamp',
  location: 'Düsseldorf, Germany',
  totalRooms: 27,

  // Current period greeting
  greeting: 'Guten Morgen!',

  // Key metrics from Booking.com data (Jan 1-10, 2026)
  stats: [
    {
      icon: 'euro',
      value: '€5,547',
      label: 'Total Revenue (Jan 1-10)',
      hasOverflowMenu: true,
      trend: '+8.3%',
    },
    {
      icon: 'bed',
      value: '78',
      label: 'Total Bookings',
      hasOverflowMenu: false,
      trend: '+12%',
    },
    {
      icon: 'users',
      value: '159',
      label: 'Total Guests',
      hasOverflowMenu: false,
      trend: '+5.2%',
    },
    {
      icon: 'calendar',
      value: '129',
      label: 'Room Nights Booked',
      hasOverflowMenu: false,
      trend: '+6.8%',
    },
  ],

  // Revenue chart - Daily revenue from real data
  revenueChart: {
    title: 'Daily Revenue',
    subtitle: 'Booking.com channel performance',
    metrics: [
      {
        label: 'Gross Revenue',
        value: '€5,546.83',
        delta: '+8.3%',
        tone: 'success' as const,
      },
      {
        label: 'Commission (12%)',
        value: '€661.19',
        delta: '-12%',
        tone: 'danger' as const,
      },
    ],
    data: [
      { month: 'Jan 1', value: 128 },
      { month: 'Jan 2', value: 982 },
      { month: 'Jan 3', value: 352 },
      { month: 'Jan 4', value: 472 },
      { month: 'Jan 5', value: 554 },
      { month: 'Jan 6', value: 1038 },
      { month: 'Jan 7', value: 293 },
      { month: 'Jan 8', value: 261 },
      { month: 'Jan 9', value: 1012 },
      { month: 'Jan 10', value: 454 },
    ],
    activeMonth: 'Jan 2',
    tooltipData: [
      { label: '€982.24', color: 'primary-400' },
      { label: '15 bookings', color: 'primary-700' },
    ],
  },

  // Key performance metrics
  performance: {
    title: 'Performance Metrics',
    subtitle: 'January 1-10, 2026',
    progress: 0.48, // 48% of month complete
    metrics: [
      { label: 'Average Daily Rate', value: '€43.00' },
      { label: 'Avg Stay Length', value: '1.65 nights' },
      { label: 'Net Revenue', value: '€4,885.64' },
      { label: 'Cancelled Bookings', value: '2' },
    ],
  },

  // Occupancy rate (simplified - would need total available room nights)
  occupancyRate: {
    title: 'Occupancy Rate',
    subtitle: 'Room utilization overview',
    value: 0.478, // 47.8% (129 nights / 270 total room nights for 10 days)
    supportingText:
      '129 room nights booked out of 270 available (27 rooms × 10 days)',
    miniStats: [
      { label: 'Rooms Sold', value: '129' },
      { label: 'Available', value: '270' },
    ],
  },

  // Top performing rooms from real data
  topRooms: [
    {
      id: '1',
      name: 'DO#17',
      type: 'Double Room',
      revenue: '€556.69',
      bookings: '4 bookings',
      status: 'High Demand',
      time: '4 nights',
    },
    {
      id: '2',
      name: 'DO#24',
      type: 'Double Room',
      revenue: '€521.45',
      bookings: '3 bookings',
      status: 'Popular',
      time: '3 nights',
    },
  ],
};
