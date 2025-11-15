import React from "react";

const MyTicketSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="bg-opacity-95 sticky top-0 z-50 border-b border-gray-800 bg-gray-950 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="h-6 w-48 animate-pulse rounded bg-gray-800" />
            <div className="h-8 w-24 animate-pulse rounded bg-gray-800" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-800 p-6 sm:rounded-3xl sm:p-8">
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 animate-pulse rounded-full bg-gray-800" />
            <div className="flex-1 space-y-3">
              <div className="h-6 w-1/2 animate-pulse rounded bg-gray-800" />
              <div className="h-4 w-1/3 animate-pulse rounded bg-gray-800" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-gray-800" />
            </div>
          </div>
        </div>

        <div className="mb-6 sm:mb-8">
          <div className="flex gap-2 border-b border-gray-800 sm:gap-4">
            <div className="h-8 w-24 animate-pulse rounded bg-gray-800" />
            <div className="h-8 w-28 animate-pulse rounded bg-gray-800" />
            <div className="h-8 w-20 animate-pulse rounded bg-gray-800" />
          </div>
        </div>

        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="group relative animate-pulse overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-800 p-6 sm:rounded-3xl"
            >
              <div className="flex flex-col md:flex-row">
                <div className="relative md:w-1/3">
                  <div className="h-48 w-full rounded-md bg-gray-800" />
                </div>

                <div className="p-6 sm:p-8 md:w-2/3">
                  <div className="mb-4">
                    <div className="mb-3 h-4 w-1/4 rounded bg-gray-800" />
                    <div className="mb-2 h-6 w-3/4 rounded bg-gray-800" />
                    <div className="h-4 w-full rounded bg-gray-800" />
                  </div>

                  <div className="mb-6 grid grid-cols-2 gap-4">
                    <div className="h-10 w-full rounded bg-gray-800" />
                    <div className="h-10 w-full rounded bg-gray-800" />
                    <div className="h-10 w-full rounded bg-gray-800" />
                    <div className="h-10 w-full rounded bg-gray-800" />
                  </div>

                  <div className="flex gap-3">
                    <div className="h-10 flex-1 rounded bg-gray-800" />
                    <div className="h-10 flex-1 rounded bg-gray-800" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyTicketSkeleton;
