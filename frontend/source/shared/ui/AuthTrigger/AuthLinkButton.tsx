"use client";

import type { ReactNode } from "react";
import { useAuthModal, type AuthTab } from "@/source/shared/lib/auth-modal";

interface Props {
  tab?: AuthTab;
  className?: string;
  children: ReactNode;
}

export function AuthLinkButton({ tab = "login", className, children }: Props) {
  const { openAuth } = useAuthModal();

  return (
    <button type="button" className={className} onClick={() => openAuth(tab)}>
      {children}
    </button>
  );
}
