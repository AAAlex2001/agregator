"use client";

import { useAuthModal } from "@/source/shared/lib/auth-modal";
import { AuthModal } from "./AuthModal";

export function AuthModalHost() {
  const { isOpen, tab, preset, close } = useAuthModal();

  if (!isOpen) return null;

  return <AuthModal initialTab={tab} preset={preset} onClose={close} />;
}
