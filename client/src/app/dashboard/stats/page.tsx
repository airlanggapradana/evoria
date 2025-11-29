import React from "react";
import NavbarDashboard from "@/components/dashboard/NavbarDashboard";
import StatisticsChart from "@/components/dashboard/StatisticsChart";

const RegistrationStatistics: React.FC = () => {
  return (
    <>
      {/* Header */}
      <NavbarDashboard />
      <div className="min-h-screen bg-gray-950 py-6 text-white sm:py-8">
        <StatisticsChart />
      </div>
    </>
  );
};

export default RegistrationStatistics;
