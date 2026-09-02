import React from "react";

const FeaturedEventSkeleton = () => {
  return (
    <section className="bg-slate-50/50 py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <div className="mx-auto h-6 w-36 animate-pulse rounded-full bg-slate-200" />
          <div className="mx-auto mt-4 h-10 w-72 animate-pulse rounded-2xl bg-slate-200" />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-3xl border border-slate-100 bg-white p-4 shadow-sm"
            >
              <div className="h-48 w-full animate-pulse rounded-2xl bg-slate-200" />
              <div className="mt-4 space-y-3">
                <div className="h-5 w-24 animate-pulse rounded-full bg-slate-200" />
                <div className="h-6 w-3/4 animate-pulse rounded-xl bg-slate-200" />
                <div className="h-4 w-1/2 animate-pulse rounded-lg bg-slate-200" />
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <div className="h-6 w-24 animate-pulse rounded-lg bg-slate-200" />
                  <div className="h-9 w-28 animate-pulse rounded-full bg-slate-200" />
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
