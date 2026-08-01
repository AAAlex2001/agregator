"use client";

import Button from "@/source/shared/ui/Button";
import { useAuthModal } from "@/source/shared/lib/auth-modal";

interface Props {
  className?: string;
}

export function StartWorkingButton({ className }: Props) {
  const { openAuth } = useAuthModal();

  return (
    <Button
      variant="primary"
      fullWidth
      showArrow
      className={className}
      onClick={() => openAuth("register")}
    >
      Начать работать
    </Button>
  );
}
