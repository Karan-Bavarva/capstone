import React from "react";
import PageHeader from "./PageHeader";

/**
 * Page wrapper component
 * Props:
 * - title: string
 * - subtitle: string
 * - actions: node (right-side controls)
 * - card: boolean (wrap children in white card with padding)
 * - children: node
 */
const Page = ({ title, subtitle, actions, card = true, children, className = "" }) => {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      <PageHeader title={title} subtitle={subtitle} actions={actions} />

      {card ? (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6">{children}</div>
      ) : (
        <div>{children}</div>
      )}
    </div>
  );
};

export default Page;
