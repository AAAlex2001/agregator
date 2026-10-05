"use client";

import { useEffect, useRef } from "react";
import { clearReferralCode, saveReferralCode } from "@/source/entities/referral";
import { useSession } from "@/source/features/session";
import { useAuthModal } from "@/source/shared/lib/auth-modal";

/** Сохраняет приглашение и открывает существующую регистрацию исполнителя. */
export function useReferralInvitation(referralCode: string | null) {
  const { user, isLoading, error } = useSession();
  const { openAuth } = useAuthModal();
  const opened = useRef(false);

  useEffect(() => {
    if (isLoading || error || opened.current) return;
    opened.current = true;

    if (user || !referralCode) {
      clearReferralCode();
      return;
    }

    saveReferralCode(referralCode);
    openAuth("register", { role: "EXPERT" });
  }, [isLoading, error, user, referralCode, openAuth]);

  function openRegistration(): void {
    if (referralCode) saveReferralCode(referralCode);
    openAuth("register", { role: "EXPERT" });
  }

  function openLogin(): void {
    openAuth("login");
  }

  return { isAuthenticated: Boolean(user), isLoading, error, openRegistration, openLogin };
}
