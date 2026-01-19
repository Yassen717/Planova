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
        <div className="h-9 w-9 rounded-xl bg-slate-200 animate-pulse"></div>
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

  // Generate gradient based on name
  const gradients = [
    'from-indigo-500 to-violet-500',
    'from-violet-500 to-cyan-500',
    'from-cyan-500 to-emerald-500',
    'from-rose-500 to-orange-500',
    'from-violet-500 to-purple-500',
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-orange-500',
  ];
  const nameHash = (user.name || user.email || 'U').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const gradient = gradients[nameHash % gradients.length];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 rounded-xl p-1.5 hover:bg-slate-100 transition-all duration-200"
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name || "User"}
              className="h-9 w-9 rounded-xl object-cover ring-2 ring-white shadow-sm"
            />
          ) : (
            <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-sm font-semibold shadow-lg shadow-indigo-500/20 ring-2 ring-white`}>
              {initials}
            </div>
          )}
          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold text-slate-900">{user.name || "User"}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
        </div>
        <svg
          className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
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
        <div className="absolute right-0 mt-2 w-64 rounded-2xl shadow-xl shadow-slate-200/50 bg-white ring-1 ring-slate-200/60 z-50 overflow-hidden animate-scale-in">
          <div className="p-4 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100">
            <div className="flex items-center gap-3">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "User"}
                  className="h-12 w-12 rounded-xl object-cover ring-2 ring-white shadow-sm"
                />
              ) : (
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-lg font-semibold shadow-lg shadow-indigo-500/20`}>
                  {initials}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{user.name || "User"}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
                {(user as any).role && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-indigo-100 text-indigo-700 mt-1">
                    {(user as any).role}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-2" role="menu" aria-orientation="vertical">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              <svg
                className="h-5 w-5 text-slate-400"
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
            </Link>

            <Link
              href="/projects"
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              <svg
                className="h-5 w-5 text-slate-400"
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
            </Link>

            <Link
              href="/tasks"
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              <svg
                className="h-5 w-5 text-slate-400"
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
            </Link>
          </div>

          <div className="p-2 border-t border-slate-100">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              role="menuitem"
            >
              <svg
                className="h-5 w-5 text-red-400"
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
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
