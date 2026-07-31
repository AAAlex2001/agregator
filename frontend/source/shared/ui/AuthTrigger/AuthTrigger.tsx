"use client";

import Button from "@/source/shared/ui/Button";
import { useAuthModal, type AuthTab } from "@/source/shared/lib/auth-modal";

type Props = Omit<React.ComponentProps<typeof Button>, "href" | "onClick"> & {
  tab?: AuthTab;
};

export function AuthTrigger({ tab = "login", children, ...buttonProps }: Props) {
  const { openAuth } = useAuthModal();

  return (
    <Button {...buttonProps} onClick={() => openAuth(tab)}>
      {children}
    </Button>
  );
}
