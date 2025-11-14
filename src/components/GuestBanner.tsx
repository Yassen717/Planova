"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function GuestBanner() {
  const { data: session } = useSession();
  
  if (!session?.user || (session.user as any).role !== "GUEST") {
    return null;
  }

  return (
    <div className="bg-yellow-50 border-b border-yellow-200">
      <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap">
          <div className="w-0 flex-1 flex items-center">
            <span className="flex p-2 rounded-lg bg-yellow-100">
              <svg
                className="h-5 w-5 text-yellow-600"
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
            <p className="ml-3 font-medium text-yellow-800 text-sm">
              You're browsing as a guest. Some features are limited.{" "}
              <Link
                href="/auth/register"
                className="underline font-semibold hover:text-yellow-900"
              >
                Create an account
              </Link>{" "}
              for full access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
