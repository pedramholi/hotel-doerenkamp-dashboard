'use client';

import { GlassNav } from '@/components/dashboard/GlassNav';

export default function PeoplesPage() {
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-violet-50/60 via-sky-50/40 to-rose-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="relative z-10 w-full min-h-screen px-4 md:px-5 xl:px-6 py-5 xl:py-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-gray-50/40 via-white/30 to-gray-50/40 dark:from-gray-900/40 dark:via-gray-800/30 dark:to-gray-900/40 backdrop-blur-sm rounded-3xl xl:rounded-[2rem] p-4 md:p-5 xl:p-6 shadow-2xl border border-white/20 dark:border-white/5">
            <div className="mb-4">
              <GlassNav />
            </div>
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-2">
                Peoples
              </h1>
              <p className="text-gray-900/52 dark:text-gray-50/55">
                Coming soon...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
