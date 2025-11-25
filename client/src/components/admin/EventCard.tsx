"use client";
import React from "react";
import {
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  MoreVertical,
  AlertTriangle,
  Eye,
} from "lucide-react";
import type { Event } from "@/types/get-incoming-events.type";

type Props = {
  event: Event;
  isPending: boolean;
  onOpen: (event: Event) => void;
  onApprove: () => Promise<number | void>;
  onReject: () => Promise<number | void>;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-500 bg-opacity-20 text-yellow-200 border-yellow-500";
    case "APPROVED":
      return "bg-green-500 bg-opacity-20 text-green-100 border-green-500";
    case "REJECTED":
      return "bg-red-500 bg-opacity-20 text-red-200 border-red-500";
    default:
      return "bg-gray-500 bg-opacity-20 text-gray-200 border-gray-500";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "PENDING":
      return <Clock className="h-4 w-4" />;
    case "APPROVED":
      return <CheckCircle className="h-4 w-4" />;
    case "REJECTED":
      return <XCircle className="h-4 w-4" />;
    default:
      return <AlertTriangle className="h-4 w-4" />;
  }
};

const formatDate = (dateString: Date) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const EventCard: React.FC<Props> = ({
  event,
  isPending,
  onOpen,
  onApprove,
  onReject,
}) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 transition-all hover:border-gray-600 sm:rounded-2xl">
      <div className="p-4 sm:p-6">
        <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex items-start gap-3">
              <div
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold sm:gap-2 sm:px-3 sm:py-1.5 sm:text-sm ${getStatusColor(
                  event.status,
                )}`}
              >
                {getStatusIcon(event.status)}
                <span>{event.status}</span>
              </div>
              {event.status === "PENDING" && (
                <div className="bg-opacity-20 rounded-full bg-orange-500 px-2.5 py-1 text-xs font-semibold text-orange-200 sm:px-3 sm:py-1.5 sm:text-sm">
                  Butuh Tindakan
                </div>
              )}
            </div>
            <h3 className="mb-2 truncate text-lg font-bold sm:text-xl">
              {event.title}
            </h3>
            <p className="mb-3 line-clamp-2 text-xs text-gray-400 sm:text-sm">
              {event.description}
            </p>
            <div className="flex flex-wrap gap-3 text-xs text-gray-400 sm:gap-4 sm:text-sm">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                {formatDate(event.startTime)}
              </span>
              <span className="flex items-center gap-1 truncate">
                <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                {event.organizer.name}
              </span>
              <span className="rounded-full bg-gray-800 px-2 py-0.5 text-xs">
                {event.category}
              </span>
            </div>
          </div>
          <button
            onClick={() => onOpen(event)}
            className="rounded-lg bg-gray-800 p-2 transition-colors hover:bg-gray-700 sm:self-start"
            aria-label="Open event actions"
          >
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3 sm:mb-6 sm:grid-cols-4 sm:gap-4">
          <div className="rounded-lg bg-gray-800 p-2.5 text-center sm:p-3">
            <div className="truncate text-base font-bold text-indigo-400 sm:text-xl">
              {event.location}
            </div>
            <div className="text-xs text-gray-500">Location</div>
          </div>
          <div className="rounded-lg bg-gray-800 p-2.5 text-center sm:p-3">
            <div className="text-base font-bold text-green-400 sm:text-xl">
              {event.expectedAttendees}
            </div>
            <div className="text-xs text-gray-500">Expected</div>
          </div>
          <div className="rounded-lg bg-gray-800 p-2.5 text-center sm:p-3">
            <div className="text-base font-bold text-purple-400 sm:text-xl">
              {event.isPaid ? "PAID" : "FREE"}
            </div>
            <div className="text-xs text-gray-500">Type</div>
          </div>
          <div className="rounded-lg bg-gray-800 p-2.5 text-center sm:p-3">
            <div className="text-xs font-bold text-gray-400 sm:text-sm">
              {formatDate(event.submittedAt)}
            </div>
            <div className="text-xs text-gray-500">Submitted</div>
          </div>
        </div>

        {event.status === "PENDING" && (
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <button
              disabled={isPending}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-xl sm:py-3 sm:text-base"
              onClick={onApprove}
            >
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              Approve
            </button>
            <button
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-red-500 sm:rounded-xl sm:py-3 sm:text-base"
              onClick={onReject}
            >
              <XCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              Reject
            </button>
            <button
              className="flex items-center justify-center gap-2 rounded-lg bg-gray-700 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-gray-600 sm:flex-none sm:rounded-xl sm:py-3 sm:text-base"
              onClick={() => onOpen(event)}
            >
              <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Details</span>
            </button>
          </div>
        )}

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

        {event.status === "APPROVED" && (
          <div className="flex gap-2 sm:gap-3">
            <button
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-700 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-gray-600 sm:rounded-xl sm:py-3 sm:text-base"
              onClick={() => onOpen(event)}
            >
              <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
              View Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
