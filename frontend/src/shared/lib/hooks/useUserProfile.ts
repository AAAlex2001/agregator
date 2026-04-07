"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { fetchProfile } from "@/features/profile/settings/model/api";
import type { UserProfile } from "@/features/profile/settings/model/types";

interface UseUserProfileResult {
  profile: UserProfile | null;
  isLoading: boolean;
  displayName: string;
  balance: number;
  rating: number;
  reviewCount: number;
  role: string;
  reload: () => void;
}

export function useUserProfile(): UseUserProfileResult {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  const load = async () => {
    setIsLoading(true);
    try {
      const data = await fetchProfile();
      setProfile(data);
    } catch {
      // fallback to null
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const displayName = profile
    ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || "Пользователь"
    : "Пользователь";
  const balance = profile?.balance ?? 0;
  const rating = profile?.rating ?? 0;
  const reviewCount = profile?.review_count ?? 0;
  // Pathname — мгновенный и надёжный источник роли (все страницы под /customer или /expert).
  const pathnameRole = pathname.startsWith("/customer")
    ? "CUSTOMER"
    : pathname.startsWith("/expert")
      ? "EXPERT"
      : null;
  const role = pathnameRole ?? profile?.role ?? "EXPERT";

  return {
    profile,
    isLoading,
    displayName,
    balance,
    rating,
    reviewCount,
    role,
    reload: () => void load(),
  };
}
