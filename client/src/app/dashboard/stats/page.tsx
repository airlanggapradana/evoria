"use client";
import React, { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  TrendingUp,
  Calendar,
  Users,
  Activity,
  Download,
  RefreshCw,
} from "lucide-react";
import NavbarDashboard from "@/components/dashboard/NavbarDashboard";

type ChartType = "line" | "bar" | "area";

interface Statistics {
  message: string;
  data: {
    labels: string[];
    counts: number[];
  };
}

type RechartsTooltipItem = {
  payload: { date: string };
  value: number;
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: RechartsTooltipItem[];
}

const RegistrationStatistics: React.FC = () => {
  const [chartType, setChartType] = useState<ChartType>("line");
  const [timeRange] = useState("7days");

  const statisticsData: Statistics = {
    message: "Registration chart data",
    data: {
      labels: [
        "2025-11-20",
        "2025-11-21",
        "2025-11-22",
        "2025-11-23",
        "2025-11-24",
        "2025-11-25",
        "2025-11-26",
      ],
      counts: [170, 200, 150, 210, 100, 200, 300],
    },
  };

  const labels = statisticsData.data.labels;
  const counts = statisticsData.data.counts;

  // Transform data for recharts (safe indexing)
  const chartData = labels.map((label, index) => ({
    date: new Date(label).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    registrations: counts[index] ?? 0,
  }));

  // Calculate statistics (use numeric variables for comparisons)
  const totalRegistrations = counts.reduce((sum, count) => sum + count, 0);
  const averageRegistrations =
    counts.length > 0 ? Math.round(totalRegistrations / counts.length) : 0;
  const maxRegistrations = counts.length > 0 ? Math.max(...counts) : 0;
  const minRegistrations = counts.length > 0 ? Math.min(...counts) : 0;

  const firstCount = counts[0] ?? 0;
  const lastCount = counts.at(-1) ?? 0;
  const growthNumber =
    counts.length > 1 && firstCount !== 0
      ? ((lastCount - firstCount) / firstCount) * 100
      : 0;
  const growth = Number(growthNumber.toFixed(1));

  const CustomTooltip: React.FC<CustomTooltipProps> = ({
    active,
    payload,
  } = {}) => {
    if (active && payload?.length) {
      const item = payload[0];
      return (
        <div className="rounded-xl border border-gray-700 bg-gray-900 p-3 shadow-xl">
          <p className="mb-1 text-sm text-gray-400">{item?.payload.date}</p>
          <p className="text-lg font-bold text-indigo-400">
            {item?.value} registrations
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {/* Header */}
      <NavbarDashboard />
      <div className="min-h-screen bg-gray-950 py-6 text-white sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="mb-2 text-2xl font-bold sm:text-3xl md:text-4xl">
              Registration Statistics
            </h1>
            <p className="text-sm text-gray-400 sm:text-base">
              Track registration trends over time
            </p>
          </div>

          {/* Stats Grid */}
          <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-4 lg:grid-cols-4 lg:gap-6">
            <div className="rounded-xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:rounded-2xl sm:p-6">
              <div className="mb-3 flex items-start justify-between sm:mb-4">
                <div className="bg-opacity-20 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500 sm:h-12 sm:w-12">
                  <Users className="h-5 w-5 text-indigo-200 sm:h-6 sm:w-6" />
                </div>
                <TrendingUp className="h-4 w-4 text-green-400 sm:h-5 sm:w-5" />
              </div>
              <div className="mb-1 text-2xl font-bold sm:text-3xl">
                {totalRegistrations}
              </div>
              <div className="text-xs text-gray-400 sm:text-sm">
                Total Registrations
              </div>
            </div>

            <div className="rounded-xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:rounded-2xl sm:p-6">
              <div className="mb-3 flex items-start justify-between sm:mb-4">
                <div className="bg-opacity-20 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500 sm:h-12 sm:w-12">
                  <Activity className="h-5 w-5 text-purple-200 sm:h-6 sm:w-6" />
                </div>
              </div>
              <div className="mb-1 text-2xl font-bold sm:text-3xl">
                {averageRegistrations}
              </div>
              <div className="text-xs text-gray-400 sm:text-sm">
                Daily Average
              </div>
            </div>

            <div className="rounded-xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:rounded-2xl sm:p-6">
              <div className="mb-3 flex items-start justify-between sm:mb-4">
                <div className="bg-opacity-20 flex h-10 w-10 items-center justify-center rounded-lg bg-green-500 sm:h-12 sm:w-12">
                  <TrendingUp className="h-5 w-5 text-green-200 sm:h-6 sm:w-6" />
                </div>
              </div>
              <div className="mb-1 text-2xl font-bold sm:text-3xl">
                {maxRegistrations}
              </div>
              <div className="text-xs text-gray-400 sm:text-sm">Peak Day</div>
            </div>

            <div className="rounded-xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:rounded-2xl sm:p-6">
              <div className="mb-3 flex items-start justify-between sm:mb-4">
                <div className="bg-opacity-20 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500 sm:h-12 sm:w-12">
                  <Calendar className="h-5 w-5 text-cyan-200 sm:h-6 sm:w-6" />
                </div>
              </div>
              <div
                className={`mb-1 text-2xl font-bold sm:text-3xl ${growthNumber >= 0 ? "text-green-400" : "text-red-400"}`}
              >
                {growthNumber > 0 ? "+" : ""}
                {growth}%
              </div>
              <div className="text-xs text-gray-400 sm:text-sm">
                Growth Rate
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mb-6 rounded-xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:mb-8 sm:rounded-2xl sm:p-6">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="mb-2 text-base font-bold sm:text-lg">
                  Chart Type
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setChartType("line")}
                    className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all sm:px-4 ${
                      chartType === "line"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    Line
                  </button>
                  <button
                    onClick={() => setChartType("bar")}
                    className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all sm:px-4 ${
                      chartType === "bar"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    Bar
                  </button>
                  <button
                    onClick={() => setChartType("area")}
                    className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all sm:px-4 ${
                      chartType === "area"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    Area
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex items-center gap-2 rounded-lg bg-gray-800 px-3 py-2 text-sm font-semibold transition-colors hover:bg-gray-700 sm:px-4">
                  <RefreshCw className="h-4 w-4" />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                <button className="flex items-center gap-2 rounded-lg bg-gray-800 px-3 py-2 text-sm font-semibold transition-colors hover:bg-gray-700 sm:px-4">
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="rounded-xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:rounded-2xl sm:p-6 lg:p-8">
            <h3 className="mb-4 text-lg font-bold sm:mb-6 sm:text-xl">
              Registration Trend
            </h3>

            <div className="w-full" style={{ height: "400px" }}>
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "line" ? (
                  <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="date"
                      stroke="#9CA3AF"
                      tick={{ fill: "#9CA3AF", fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      stroke="#9CA3AF"
                      tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="registrations"
                      stroke="#6366F1"
                      strokeWidth={3}
                      dot={{ fill: "#6366F1", r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                ) : chartType === "bar" ? (
                  <BarChart
                    data={chartData}
                    margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="date"
                      stroke="#9CA3AF"
                      tick={{ fill: "#9CA3AF", fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      stroke="#9CA3AF"
                      tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="registrations"
                      fill="#6366F1"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                ) : (
                  <AreaChart
                    data={chartData}
                    margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="date"
                      stroke="#9CA3AF"
                      tick={{ fill: "#9CA3AF", fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      stroke="#9CA3AF"
                      tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="registrations"
                      stroke="#6366F1"
                      fill="#6366F1"
                      fillOpacity={0.3}
                      strokeWidth={3}
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Data Table */}
          <div className="mt-6 rounded-xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:mt-8 sm:rounded-2xl sm:p-6">
            <h3 className="mb-4 text-lg font-bold sm:text-xl">
              Daily Breakdown
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="pb-3 text-xs font-semibold text-gray-400 sm:text-sm">
                      Date
                    </th>
                    <th className="pb-3 text-right text-xs font-semibold text-gray-400 sm:text-sm">
                      Registrations
                    </th>
                    <th className="hidden pb-3 text-right text-xs font-semibold text-gray-400 sm:table-cell sm:text-sm">
                      Change
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {labels.map((label, index) => {
                    const prev = index > 0 ? (counts[index - 1] ?? 0) : 0;
                    const curr = counts[index] ?? 0;
                    const changeNumber =
                      index > 0 && prev !== 0
                        ? ((curr - prev) / prev) * 100
                        : 0;
                    const change = Number(changeNumber.toFixed(1));

                    return (
                      <tr
                        key={index}
                        className="border-b border-gray-800 last:border-0"
                      >
                        <td className="py-3 text-xs sm:text-sm">
                          {new Date(label).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="py-3 text-right text-xs font-bold sm:text-sm">
                          {curr}
                        </td>
                        <td className="hidden py-3 text-right text-xs sm:table-cell sm:text-sm">
                          {index > 0 && (
                            <span
                              className={`${changeNumber >= 0 ? "text-green-400" : "text-red-400"}`}
                            >
                              {changeNumber > 0 ? "+" : ""}
                              {change}%
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegistrationStatistics;
