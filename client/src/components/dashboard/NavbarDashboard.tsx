"use client";
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { deleteCookie } from "@/utils/cookies";
import { RiLogoutBoxLine } from "react-icons/ri";

const NavbarDashboard = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className="bg-opacity-95 sticky top-0 z-50 border-b border-gray-800 bg-gray-950 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        <div className="flex h-14 items-center justify-between sm:h-16">
          <div className="flex items-center gap-2 sm:gap-4">
            <h1 className="truncate text-lg font-bold sm:text-xl">
              Event Manager
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-2 text-sm font-semibold transition-all hover:from-indigo-500 hover:to-purple-500 sm:px-4 sm:text-base">
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="xs:inline hidden">Create</span>
            </button>
            <button
              className="rounded-lg bg-gray-800 p-2 transition-colors hover:bg-gray-700"
              onClick={async () => {
                await deleteCookie("access_token");
                await deleteCookie("refresh_token");
                window.location.reload();
              }}
            >
              <RiLogoutBoxLine className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarDashboard;
