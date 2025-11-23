import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="min-h-screen bg-gray-950 text-white">{children}</div>;
};

export default DashboardLayout;
