import React from "react";

const DashboardSkeleton = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
      <div className="w-full max-w-4xl space-y-6 px-4">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 animate-pulse rounded-md bg-gray-800" />
          <div className="flex-1">
            <div className="mb-2 h-4 w-48 animate-pulse rounded bg-gray-800" />
            <div className="h-3 w-32 animate-pulse rounded bg-gray-800" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="h-12 w-12 animate-pulse rounded-xl bg-gray-800" />
                <div className="h-5 w-12 animate-pulse rounded bg-gray-800" />
              </div>
              <div className="mb-2 h-8 w-24 animate-pulse rounded bg-gray-800" />
              <div className="h-3 w-20 animate-pulse rounded bg-gray-800" />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 p-6"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 h-5 w-56 animate-pulse rounded bg-gray-800" />
                  <div className="h-3 w-40 animate-pulse rounded bg-gray-800" />
                </div>
                <div className="h-8 w-8 animate-pulse rounded bg-gray-800" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="h-10 animate-pulse rounded bg-gray-800" />
                <div className="h-10 animate-pulse rounded bg-gray-800" />
                <div className="h-10 animate-pulse rounded bg-gray-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
