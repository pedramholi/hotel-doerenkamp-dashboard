'use client';

import { GlassNav } from '@/components/dashboard/GlassNav';
import { StatCards } from '@/components/dashboard/StatCards';
import { AverageSalesChart } from '@/components/dashboard/AverageSalesChart';
import { FormationStatus } from '@/components/dashboard/FormationStatus';
import { SuccessRate } from '@/components/dashboard/SuccessRate';
import { RecentEmails } from '@/components/dashboard/RecentEmails';
import { SmartBookingUpload } from '@/components/dashboard/SmartBookingUpload';
import { XLSXLoader } from '@/components/dashboard/XLSXLoader';
import { RevPARCard } from '@/components/dashboard/RevPARCard';
import { CountryChart } from '@/components/dashboard/CountryChart';
import { EnhancedPerformance } from '@/components/dashboard/EnhancedPerformance';
import { generateDashboardData } from '@/lib/dashboard-data-generator';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only load data on client side to avoid hydration mismatch
    setDashboardData(generateDashboardData());
    setIsLoading(false);
  }, []);

  const handleImportComplete = () => {
    // Refresh dashboard data after import
    setDashboardData(generateDashboardData());
  };

  // Show loading state during SSR/hydration
  if (isLoading || !dashboardData) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-violet-50/60 via-sky-50/40 to-rose-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  return (
    <>
      <XLSXLoader />
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
                {dashboardData.hotelName}
              </h1>
              <p className="text-sm text-gray-900/52 dark:text-gray-50/55">
                {dashboardData.location} • {dashboardData.greeting}
              </p>
            </div>

            {/* Stat Cards Row */}
            <div className="mb-4 xl:mb-5">
              <StatCards stats={dashboardData.stats} />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 xl:gap-5">
              {/* Left Column - Chart and Top Rooms */}
              <div className="lg:col-span-8 space-y-4 xl:space-y-5">
                {/* Revenue Chart */}
                <AverageSalesChart
                  title={dashboardData.revenueChart.title}
                  subtitle={dashboardData.revenueChart.subtitle}
                  metrics={dashboardData.revenueChart.metrics}
                  data={dashboardData.revenueChart.data}
                  activeMonth={dashboardData.revenueChart.activeMonth}
                  tooltipData={dashboardData.revenueChart.tooltipData}
                />

                {/* Two Column Grid - Top Rooms and Country Chart */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-5">
                  {/* Top Performing Rooms */}
                  <RecentEmails
                    emails={dashboardData.topRooms}
                    title="Top Performing Rooms"
                  />

                  {/* Revenue by Country */}
                  <CountryChart
                    data={dashboardData.enhancedMetrics.revenueByCountry}
                    topN={5}
                  />
                </div>
              </div>

              {/* Right Column - Upload, RevPAR, Performance and Occupancy */}
              <div className="lg:col-span-4 space-y-4 xl:space-y-5">
                {/* Booking Upload */}
                <SmartBookingUpload onImportComplete={handleImportComplete} />

                {/* RevPAR Card */}
                <RevPARCard
                  revPAR={dashboardData.enhancedMetrics.revPAR}
                  cancellationRate={dashboardData.enhancedMetrics.cancellationRate}
                  distributionCost={dashboardData.enhancedMetrics.distributionCost}
                />

                {/* Enhanced Performance Metrics */}
                <EnhancedPerformance
                  title={dashboardData.performance.title}
                  subtitle={dashboardData.performance.subtitle}
                  futureOccupancy={dashboardData.enhancedMetrics.futureOccupancy}
                  metrics={dashboardData.performance.metrics}
                />

                {/* Occupancy Rate */}
                <SuccessRate
                  title={dashboardData.occupancyRate.title}
                  subtitle={dashboardData.occupancyRate.subtitle}
                  value={dashboardData.occupancyRate.value}
                  supportingText={dashboardData.occupancyRate.supportingText}
                  miniStats={dashboardData.occupancyRate.miniStats}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
