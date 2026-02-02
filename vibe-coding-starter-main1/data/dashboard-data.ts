export const dashboardData = {
  greeting: 'Good morning, James!',

  stats: [
    {
      icon: 'wallet',
      value: '$143,624',
      label: 'Your bank balance',
      hasOverflowMenu: true,
    },
    {
      icon: 'pie',
      value: '12',
      label: 'Uncategorized transactions',
      hasOverflowMenu: false,
    },
    {
      icon: 'truck',
      value: '7',
      label: 'Employees working today',
      hasOverflowMenu: false,
    },
    {
      icon: 'receipt',
      value: '$3,287.49',
      label: "This week's card spending",
      hasOverflowMenu: false,
    },
  ],

  salesChart: {
    title: 'Average Sales',
    subtitle: 'Sales overview from all channels',
    metrics: [
      {
        label: 'Offline',
        value: '$12,201.00',
        delta: '-11%',
        tone: 'danger' as const,
      },
      {
        label: 'Online',
        value: '$100,799.00',
        delta: '+6%',
        tone: 'success' as const,
      },
    ],
    data: [
      { month: 'Jan', value: 400 },
      { month: 'Feb', value: 300 },
      { month: 'Mar', value: 200 },
      { month: 'Apr', value: 500 },
      { month: 'May', value: 600 },
      { month: 'Jun', value: 350 },
      { month: 'Jul', value: 450 },
      { month: 'Aug', value: 380 },
      { month: 'Sep', value: 320 },
    ],
    activeMonth: 'May',
    tooltipData: [
      { label: '$598.00', color: 'primary-400' },
      { label: '$245.00', color: 'primary-700' },
    ],
  },

  formationStatus: {
    title: 'Formation status',
    subtitle: 'In progress',
    progress: 0.70,
    estimateTitle: 'Estimated Processing',
    estimateSubtitle: '4–5 Business Days',
    ctaLabel: 'View status',
  },

  successRate: {
    title: 'Success Rate',
    subtitle: 'Lorem ipsum dolor sit amet',
    value: 0.512,
    supportingText:
      'Hooray you success to earn $150 today and $1,470 this week, keep it up',
    miniStats: [
      { label: 'Peoples', value: '15,110' },
      { label: 'New Users', value: '91,130' },
    ],
  },

  recentEmails: [
    {
      id: '1',
      name: 'Sarah Chen',
      avatar: 'SC',
      subject: 'Q4 Financial Report Review',
      invited: '12 people',
      status: 'Urgent',
      time: '1:24 PM',
    },
    {
      id: '2',
      name: 'Michael Torres',
      avatar: 'MT',
      subject: 'Team Meeting Tomorrow',
      invited: '8 people',
      status: 'Pending',
      time: '12:32 PM',
    },
  ],
};
