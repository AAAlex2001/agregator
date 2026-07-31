"use client";

import { useAuthModal } from "@/source/shared/lib/auth-modal";
import { AuthModal } from "./AuthModal";

export function AuthModalHost() {
  const { isOpen, tab, close } = useAuthModal();

  if (!isOpen) return null;

  return <AuthModal initialTab={tab} onClose={close} />;
}
