"use client";

import { useState } from "react";
import { followPostAuthor } from "@/source/entities/posts";
import { useSession } from "@/source/entities/session";
import { useAuthModal } from "@/source/shared/lib/auth-modal";

/** Подписывает на автора или отменяет подписку. */
export function useFollowAuthor(authorId: number, initial: boolean) {
  const { user } = useSession();
  const { openAuth } = useAuthModal();
  const [followingResult, setFollowingResult] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const following = followingResult ?? initial;

  const toggle = async () => {
    if (!user) return openAuth("login");
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await followPostAuthor(authorId, !following);
      setFollowingResult(!following);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Не удалось изменить подписку");
    } finally {
      setBusy(false);
    }
  };
  return { following, busy, error, toggle };
}
