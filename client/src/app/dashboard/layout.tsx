import React from "react";
import NavbarDashboard from "@/components/dashboard/NavbarDashboard";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <NavbarDashboard />

      {children}
    </div>
  );
};

export default DashboardLayout;
