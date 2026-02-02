'use client';

import { GlassNav } from '@/components/dashboard/GlassNav';
import { StatCards } from '@/components/dashboard/StatCards';
import { AverageSalesChart } from '@/components/dashboard/AverageSalesChart';
import { FormationStatus } from '@/components/dashboard/FormationStatus';
import { SuccessRate } from '@/components/dashboard/SuccessRate';
import { RecentEmails } from '@/components/dashboard/RecentEmails';
import { hotelDashboardData } from '@/data/hotel-dashboard-data';

export default function DashboardPage() {
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-violet-50/60 via-sky-50/40 to-rose-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Background Decorative Shapes - Light Mode */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Lavender wash */}
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-30 dark:opacity-20"
          style={{
            background:
              'radial-gradient(circle, rgba(139, 92, 246, 0.18), transparent 70%)',
          }}
        />
        {/* Cool blue wash */}
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-25 dark:opacity-15"
          style={{
            background:
              'radial-gradient(circle, rgba(14, 165, 233, 0.12), transparent 70%)',
          }}
        />
        {/* Soft pink wash */}
        <div
          className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] rounded-full blur-3xl opacity-20 dark:opacity-10"
          style={{
            background:
              'radial-gradient(circle, rgba(244, 63, 94, 0.14), transparent 70%)',
          }}
        />
        {/* Diagonal shapes */}
        <div
          className="absolute top-1/3 left-1/4 w-96 h-96 opacity-10 dark:opacity-5"
          style={{
            background: 'rgba(244, 63, 94, 0.18)',
            transform: 'rotate(-18deg)',
          }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-80 h-80 opacity-10 dark:opacity-5"
          style={{
            background: 'rgba(139, 92, 246, 0.14)',
            transform: 'rotate(-18deg)',
          }}
        />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full min-h-screen px-4 md:px-5 xl:px-6 py-5 xl:py-6">
        <div className="max-w-7xl mx-auto">
          {/* App Shell */}
          <div className="bg-gradient-to-br from-gray-50/40 via-white/30 to-gray-50/40 dark:from-gray-900/40 dark:via-gray-800/30 dark:to-gray-900/40 backdrop-blur-sm rounded-3xl xl:rounded-[2rem] p-4 md:p-5 xl:p-6 shadow-2xl border border-white/20 dark:border-white/5">
            {/* Navigation */}
            <div className="mb-4">
              <GlassNav />
            </div>

            {/* Hotel Header */}
            <div className="mb-4 px-1">
              <h1 className="text-xl xl:text-2xl font-bold text-gray-900 dark:text-gray-50">
                {hotelDashboardData.hotelName}
              </h1>
              <p className="text-sm text-gray-900/52 dark:text-gray-50/55">
                {hotelDashboardData.location} • {hotelDashboardData.greeting}
              </p>
            </div>

            {/* Stat Cards Row */}
            <div className="mb-4 xl:mb-5">
              <StatCards stats={hotelDashboardData.stats} />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 xl:gap-5">
              {/* Left Column - Chart and Top Rooms */}
              <div className="lg:col-span-8 space-y-4 xl:space-y-5">
                {/* Revenue Chart */}
                <AverageSalesChart
                  title={hotelDashboardData.revenueChart.title}
                  subtitle={hotelDashboardData.revenueChart.subtitle}
                  metrics={hotelDashboardData.revenueChart.metrics}
                  data={hotelDashboardData.revenueChart.data}
                  activeMonth={hotelDashboardData.revenueChart.activeMonth}
                  tooltipData={hotelDashboardData.revenueChart.tooltipData}
                />

                {/* Top Performing Rooms */}
                <RecentEmails
                  emails={hotelDashboardData.topRooms}
                  title="Top Performing Rooms"
                />
              </div>

              {/* Right Column - Performance and Occupancy */}
              <div className="lg:col-span-4 space-y-4 xl:space-y-5">
                {/* Performance Metrics */}
                <FormationStatus
                  title={hotelDashboardData.performance.title}
                  subtitle={hotelDashboardData.performance.subtitle}
                  progress={hotelDashboardData.performance.progress}
                  estimateTitle={hotelDashboardData.performance.metrics[0].label}
                  estimateSubtitle={hotelDashboardData.performance.metrics[0].value}
                  ctaLabel="View Full Report"
                />

                {/* Occupancy Rate */}
                <SuccessRate
                  title={hotelDashboardData.occupancyRate.title}
                  subtitle={hotelDashboardData.occupancyRate.subtitle}
                  value={hotelDashboardData.occupancyRate.value}
                  supportingText={hotelDashboardData.occupancyRate.supportingText}
                  miniStats={hotelDashboardData.occupancyRate.miniStats}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
