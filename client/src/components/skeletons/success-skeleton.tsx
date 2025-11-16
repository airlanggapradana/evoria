import React from "react";

const SuccessSkeleton = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4 py-12 text-white">
      <div className="w-full max-w-4xl space-y-6">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 animate-pulse items-center justify-center rounded-full bg-green-600/30">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/30" />
            </div>
            <div>
              <div className="mb-2 h-6 w-72 animate-pulse rounded bg-gray-800/60" />
              <div className="h-4 w-48 animate-pulse rounded bg-gray-800/50" />
            </div>
          </div>
        </div>

        <div className="animate-pulse rounded-3xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 p-6">
          <div className="h-40 rounded-md bg-gray-800/50" />
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="h-20 rounded-xl bg-gray-800/50" />
            <div className="h-20 rounded-xl bg-gray-800/50" />
          </div>
          <div className="mt-6 h-36 rounded-2xl bg-gray-800/40" />
          <div className="mt-6 flex gap-4">
            <div className="h-12 flex-1 rounded-xl bg-gray-800/50" />
            <div className="h-12 flex-1 rounded-xl bg-gray-800/50" />
          </div>
          <div className="mt-4 h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600/40 opacity-70" />
        </div>

        <div className="mt-2 text-center text-sm text-gray-500">
          Loading your ticket details...
        </div>
      </div>
    </div>
  );
};

export default SuccessSkeleton;
