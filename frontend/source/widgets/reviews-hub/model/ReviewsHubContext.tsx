"use client";

import { createContext, useContext, useState } from "react";
import { useSession } from "@/source/features/session";

export type DrawerAnchor = { left: number; top: number };

interface ReviewsHubContextValue {
  isAvailable: boolean;
  isOpen: boolean;
  anchor: DrawerAnchor | null;
  open: (anchor?: DrawerAnchor | null) => void;
  close: () => void;
}

const ReviewsHubContext = createContext<ReviewsHubContextValue | null>(null);

export function ReviewsHubProvider({ children }: { children: React.ReactNode }) {
  const { role } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [anchor, setAnchor] = useState<DrawerAnchor | null>(null);

  const value: ReviewsHubContextValue = {
    isAvailable: role === "EXPERT" || role === "CUSTOMER",
    isOpen,
    anchor,
    open: (next = null) => {
      setAnchor(next ?? null);
      setIsOpen(true);
    },
    close: () => setIsOpen(false),
  };

  return <ReviewsHubContext.Provider value={value}>{children}</ReviewsHubContext.Provider>;
}

export function useReviewsHub(): ReviewsHubContextValue {
  const ctx = useContext(ReviewsHubContext);
  if (!ctx) {
    return { isAvailable: false, isOpen: false, anchor: null, open: () => {}, close: () => {} };
  }
  return ctx;
}
