"use client";

import { useEffect, useRef } from "react";
import { clearReferralCode, saveReferralCode } from "@/entities/referral";
import { useUser } from "@/entities/user";
import type { ReferralInvitationOptions } from "./types";

/** Сохраняет приглашение гостя и один раз открывает регистрацию после проверки сессии. */
export function useReferralInvitation({
  referralCode,
  onOpenRegistration,
}: ReferralInvitationOptions) {
  const { user, isLoading, error } = useUser();
  const hasHandledInvitation = useRef(false);
  const isAuthenticated = Boolean(user);

  useEffect(() => {
    if (isLoading || error || hasHandledInvitation.current) {
      return;
    }

    hasHandledInvitation.current = true;

    if (isAuthenticated || !referralCode) {
      clearReferralCode();
      return;
    }

    saveReferralCode(referralCode);
    onOpenRegistration();
  }, [isLoading, error, isAuthenticated, referralCode, onOpenRegistration]);

  /** Повторно открывает регистрацию по кнопке, сохраняя код приглашения. */
  function openRegistration() {
    if (referralCode) {
      saveReferralCode(referralCode);
    }

    onOpenRegistration();
  }

  return {
    isAuthenticated,
    isLoading,
    error,
    openRegistration,
  };
}
