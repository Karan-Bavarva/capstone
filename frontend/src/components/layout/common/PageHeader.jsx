import React from "react";

const PageHeader = ({ title, subtitle, actions }) => {
  return (
    <div className="mb-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {title && (
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h1>
          )}
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>

        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
