import React from "react";
import { SidebarProvider } from "../../../context/SidebarContext";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";

const AppLayout = ({ children, title }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-100">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <AppHeader title={title} />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
