"use client";

import { useSession } from "next-auth/react";

export function useGuestCheck() {
  const { data: session } = useSession();
  
  const isGuest = session?.user && (session.user as any).role === "GUEST";
  const canCreate = !isGuest;
  const canEdit = !isGuest;
  const canDelete = !isGuest;
  
  return {
    isGuest: !!isGuest,
    canCreate,
    canEdit,
    canDelete,
    session,
  };
}
