export default function EcommerceMetrics() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* Customers */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <svg className="text-gray-800 size-6 dark:text-white/90" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
          </svg>
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Customers</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">3,782</h4>
          </div>
          <div className="inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium text-xs bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1ZM8 2.5C10.9853 2.5 13.5 5.01472 13.5 8C13.5 10.9853 10.9853 13.5 8 13.5C5.01472 13.5 2.5 10.9853 2.5 8C2.5 5.01472 5.01472 2.5 8 2.5Z"/>
            </svg>
            11.01%
          </div>
        </div>
      </div>

      {/* Orders */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <svg className="text-gray-800 size-6 dark:text-white/90" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Orders</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">5,359</h4>
          </div>
          <div className="inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium text-xs bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8C15 11.866 11.866 15 8 15ZM8 13.5C10.9853 13.5 13.5 10.9853 13.5 8C13.5 5.01472 10.9853 2.5 8 2.5C5.01472 2.5 2.5 5.01472 2.5 8C2.5 10.9853 5.01472 13.5 8 13.5Z"/>
            </svg>
            9.05%
          </div>
        </div>
      </div>
    </div>
  );
}
