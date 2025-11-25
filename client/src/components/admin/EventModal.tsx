"use client";
import React from "react";
import { X, AlertTriangle } from "lucide-react";
import type { Event } from "@/types/get-incoming-events.type";

type Props = {
  open: boolean;
  event: Event | null;
  onClose: () => void;
};

const formatDateTime = (dateString: Date) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const EventModal: React.FC<Props> = ({ open, event, onClose }) => {
  if (!open || !event) return null;

  return (
    <div className="bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-black p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 sm:rounded-3xl">
        <div className="bg-opacity-95 sticky top-0 border-b border-gray-700 bg-gray-900 p-4 backdrop-blur-md sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold sm:text-xl">Event Details</h3>
            <button
              onClick={onClose}
              className="rounded-lg bg-gray-800 p-2 transition-colors hover:bg-gray-700"
              aria-label="Close event details"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4 p-4 sm:p-6">
          <div>
            <div className="mb-1 text-xs text-gray-500 sm:text-sm">
              Event Title
            </div>
            <div className="text-sm font-semibold sm:text-base">
              {event.title}
            </div>
          </div>

          <div>
            <div className="mb-1 text-xs text-gray-500 sm:text-sm">
              Description
            </div>
            <div className="text-sm text-gray-300 sm:text-base">
              {event.description}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <div className="mb-1 text-xs text-gray-500 sm:text-sm">
                Organizer
              </div>
              <div className="text-sm font-semibold sm:text-base">
                {event.organizer.name}
              </div>
              <div className="text-xs text-gray-400 sm:text-sm">
                {event.organizer.email}
              </div>
            </div>

            <div>
              <div className="mb-1 text-xs text-gray-500 sm:text-sm">
                Location
              </div>
              <div className="text-sm font-semibold sm:text-base">
                {event.location}
              </div>
            </div>
          </div>

          <div>
            <div className="mb-1 text-xs text-gray-500 sm:text-sm">
              Event Date &amp; Time
            </div>
            <div className="text-sm sm:text-base">
              {formatDateTime(event.startTime)} -{" "}
              {formatDateTime(event.endTime)}
            </div>
          </div>

          {event.status === "REJECTED" && (
            <div className="bg-opacity-20 border-opacity-30 mt-4 rounded-lg border border-red-500 bg-red-900 p-3 sm:rounded-xl sm:p-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400 sm:h-5 sm:w-5" />
                <div>
                  <div className="mb-1 text-xs font-semibold text-red-400 sm:text-sm">
                    Alasan Penolakan:
                  </div>
                  <div className="text-xs text-gray-300 sm:text-sm">
                    Acara ini tidak memenuhi pedoman komunitas kami. Silakan
                    tinjau kembali dan ajukan kembali dengan informasi yang
                    diperbarui.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventModal;
