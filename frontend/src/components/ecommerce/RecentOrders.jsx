export default function RecentOrders() {
  const orders = [
    { id: 1, name: "MacBook Pro 13\"", category: "Laptop", price: "$2,399", status: "Delivered" },
    { id: 2, name: "Apple Watch Ultra", category: "Watch", price: "$879", status: "Pending" },
    { id: 3, name: "iPhone 15 Pro Max", category: "Phone", price: "$1,869", status: "Delivered" },
    { id: 4, name: "iPad Pro 3rd Gen", category: "Tablet", price: "$1,699", status: "Canceled" },
    { id: 5, name: "AirPods Pro 2nd Gen", category: "Audio", price: "$240", status: "Delivered" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500";
      case "Pending":
        return "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-500";
      case "Canceled":
        return "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500";
      default:
        return "bg-gray-50 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400";
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Recent Orders</h3>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.29004 5.90393H17.7067" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Filter
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            See all
          </button>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <table className="w-full">
          <thead className="border-y border-gray-100 dark:border-gray-800">
            <tr>
              <th className="py-3 text-left font-medium text-gray-500 text-theme-xs dark:text-gray-400">Product</th>
              <th className="py-3 text-left font-medium text-gray-500 text-theme-xs dark:text-gray-400">Category</th>
              <th className="py-3 text-left font-medium text-gray-500 text-theme-xs dark:text-gray-400">Price</th>
              <th className="py-3 text-left font-medium text-gray-500 text-theme-xs dark:text-gray-400">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="py-3">
                  <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">{order.name}</p>
                </td>
                <td className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">{order.category}</td>
                <td className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">{order.price}</td>
                <td className="py-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-medium text-xs ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
