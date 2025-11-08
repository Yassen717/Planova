"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import React from "react";

interface SessionProviderProps {
  children: React.ReactNode;
  session?: Session | null;
}

const SessionProvider: React.FC<SessionProviderProps> = ({ children, session }) => {
  return (
    <NextAuthSessionProvider session={session}>
      {children}
    </NextAuthSessionProvider>
  );
};

export default SessionProvider;
