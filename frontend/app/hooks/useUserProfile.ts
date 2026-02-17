"use client";

import { useEffect, useState } from "react";
import { fetchProfile } from "@/app/settings/api";
import type { UserProfile } from "@/app/settings/api";

interface UseUserProfileResult {
  profile: UserProfile | null;
  isLoading: boolean;
  displayName: string;
  rating: number;
  reviewCount: number;
  reload: () => void;
}

export function useUserProfile(): UseUserProfileResult {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
  const rating = profile?.rating ?? 0;
  const reviewCount = profile?.review_count ?? 0;

  return {
    profile,
    isLoading,
    displayName,
    rating,
    reviewCount,
    reload: () => void load(),
  };
}
