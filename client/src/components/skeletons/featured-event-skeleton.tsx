import React from "react";

const FeaturedEventSkeleton = () => {
  return (
    <section className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <div className="mx-auto h-6 w-48 animate-pulse rounded bg-gray-700/60" />
          <div className="mx-auto mt-4 h-10 w-64 animate-pulse rounded bg-gray-700/60" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-800/50 bg-gradient-to-br from-gray-900/80 to-gray-800/80 p-4 backdrop-blur-sm"
            >
              <div className="h-44 w-full animate-pulse overflow-hidden rounded-lg bg-gray-800/60" />
              <div className="mt-4 space-y-2">
                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-700/60" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-gray-700/60" />
                <div className="mt-3 flex items-center justify-between">
                  <div className="h-8 w-24 animate-pulse rounded bg-gray-700/60" />
                  <div className="h-8 w-32 animate-pulse rounded bg-gray-700/60" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedEventSkeleton;
