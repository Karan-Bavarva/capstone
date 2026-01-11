export default function DemographicCard() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Customers Demographic</h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">Number of customer based on country</p>
        </div>
        <button className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/>
          </svg>
        </button>
      </div>

      <div className="space-y-5 mt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold">🇺🇸</div>
            <div>
              <p className="font-semibold text-gray-800 text-theme-sm dark:text-white/90">USA</p>
              <span className="block text-gray-500 text-theme-xs dark:text-gray-400">2,379 Customers</span>
            </div>
          </div>
          <div className="flex w-full max-w-[140px] items-center gap-3">
            <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
              <div className="absolute left-0 top-0 h-full w-[79%] rounded-sm bg-brand-500"></div>
            </div>
            <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">79%</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold">🇫🇷</div>
            <div>
              <p className="font-semibold text-gray-800 text-theme-sm dark:text-white/90">France</p>
              <span className="block text-gray-500 text-theme-xs dark:text-gray-400">589 Customers</span>
            </div>
          </div>
          <div className="flex w-full max-w-[140px] items-center gap-3">
            <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
              <div className="absolute left-0 top-0 h-full w-[23%] rounded-sm bg-brand-500"></div>
            </div>
            <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">23%</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold">🇩🇪</div>
            <div>
              <p className="font-semibold text-gray-800 text-theme-sm dark:text-white/90">Germany</p>
              <span className="block text-gray-500 text-theme-xs dark:text-gray-400">324 Customers</span>
            </div>
          </div>
          <div className="flex w-full max-w-[140px] items-center gap-3">
            <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
              <div className="absolute left-0 top-0 h-full w-[12%] rounded-sm bg-brand-500"></div>
            </div>
            <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">12%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
