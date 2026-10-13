"use client";

import { useAuthModal } from "@/source/shared/lib/auth-modal";
import { AuthModal } from "./AuthModal";

/** Рисует окно авторизации, когда его открыли из любого места сайта. */
export function AuthModalHost() {
  const { isOpen, tab, preset, close } = useAuthModal();

  if (!isOpen) return null;

  return <AuthModal initialTab={tab} preset={preset} onClose={close} />;
}
