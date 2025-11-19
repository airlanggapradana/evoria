import { Suspense } from "react";
import CheckInContent from "@/components/checkin/CheckInContent";

export default function CheckInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
          <p className="text-lg text-gray-400">Loading...</p>
        </div>
      }
    >
      <CheckInContent />
    </Suspense>
  );
}
