import { useState } from "react";
import { Onboarding } from "../ui/onboarding";

const STORAGE_KEY = "rp_onboarding_seen_v1";

export function useShowOnboarding() {
  const [show, setShow] = useState(() => localStorage.getItem(STORAGE_KEY) !== "1");

  if (!show) return null;

  return (
    <Onboarding
      onComplete={() => {
        localStorage.setItem(STORAGE_KEY, "1");
        setShow(false);
      }}
    />
  );
}
