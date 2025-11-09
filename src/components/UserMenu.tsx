"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function UserMenu() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  if (status === "loading") {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const user = session.user;
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.email?.[0].toUpperCase() || "U";

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1 hover:bg-gray-100 transition-colors"
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        <div className="flex items-center space-x-2">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name || "User"}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
              {initials}
            </div>
          )}
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-gray-900">{user.name || "User"}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
        <svg
          className={`h-5 w-5 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">{user.name || "User"}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
              {(user as any).role && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                  {(user as any).role}
                </span>
              )}
            </div>

            <Link
              href="/dashboard"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <svg
                  className="mr-3 h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Dashboard
              </div>
            </Link>

            <Link
              href="/projects"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <svg
                  className="mr-3 h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
                Projects
              </div>
            </Link>

            <Link
              href="/tasks"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <svg
                  className="mr-3 h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Tasks
              </div>
            </Link>

            <div className="border-t border-gray-100"></div>

            <button
              onClick={handleSignOut}
              className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
              role="menuitem"
            >
              <div className="flex items-center">
                <svg
                  className="mr-3 h-5 w-5 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Sign out
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
