"use client";

import { createContext, useContext, useState } from "react";
import { useSession } from "@/source/features/session";

interface ReviewsHubContextValue {
  isAvailable: boolean;
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const ReviewsHubContext = createContext<ReviewsHubContextValue | null>(null);

export function ReviewsHubProvider({ children }: { children: React.ReactNode }) {
  const { role } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const value: ReviewsHubContextValue = {
    isAvailable: role === "EXPERT" || role === "CUSTOMER",
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };

  return <ReviewsHubContext.Provider value={value}>{children}</ReviewsHubContext.Provider>;
}

export function useReviewsHub(): ReviewsHubContextValue {
  const ctx = useContext(ReviewsHubContext);
  if (!ctx) {
    return { isAvailable: false, isOpen: false, open: () => {}, close: () => {} };
  }
  return ctx;
}
