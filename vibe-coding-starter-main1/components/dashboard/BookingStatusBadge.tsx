interface BookingStatusBadgeProps {
  status: string;
}

export function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  const getStatusStyles = () => {
    const normalizedStatus = status.toLowerCase().trim();

    if (normalizedStatus === 'ok') {
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    }

    if (normalizedStatus.includes('storniert') || normalizedStatus.includes('canceled')) {
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    }

    if (normalizedStatus.includes('wartend') || normalizedStatus.includes('pending')) {
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    }

    // Default grey for other statuses
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles()}`}
    >
      {status}
    </span>
  );
}
