"use client";

import { useState } from "react";
import { COOKIE_CONSENT_MAX_AGE, COOKIE_CONSENT_NAME } from "../config/cookie-consent";

/** Сохраняет согласие в cookie и сразу скрывает открытый баннер. */
export function useCookieConsent() {
  const [isVisible, setIsVisible] = useState(true);

  /** Запоминает принятие правил для текущего домена на один год. */
  function acceptCookies() {
    const maxAge = `max-age=${COOKIE_CONSENT_MAX_AGE}`;

    document.cookie = `${COOKIE_CONSENT_NAME}=true; path=/; ${maxAge}; samesite=lax`;
    setIsVisible(false);
  }

  return {
    isVisible,
    acceptCookies,
  };
}
