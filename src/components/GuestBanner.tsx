"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function GuestBanner() {
  const { data: session } = useSession();
  
  if (!session?.user || (session.user as any).role !== "GUEST") {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200/50">
      <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex-1 flex items-center gap-3">
            <span className="flex p-2 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 shadow-sm">
              <svg
                className="h-5 w-5 text-amber-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
            <p className="font-medium text-amber-800 text-sm">
              You're browsing as a guest with limited features.
            </p>
          </div>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-amber-700 bg-white hover:bg-amber-50 rounded-xl ring-1 ring-amber-200 hover:ring-amber-300 transition-all duration-200 shadow-sm hover:shadow"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
