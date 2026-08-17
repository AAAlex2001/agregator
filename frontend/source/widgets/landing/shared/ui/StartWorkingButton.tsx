"use client";

import Button from "@/source/shared/ui/Button";
import { scrollToRegistration } from "../lib/scrollToRegistration";

interface Props {
  className?: string;
}

export function StartWorkingButton({ className }: Props) {
  return (
    <Button
      onClick={scrollToRegistration}
      variant="primary"
      fullWidth
      showArrow
      className={className}
    >
      Начать работать
    </Button>
  );
}
