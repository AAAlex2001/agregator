"use client";

import Button from "@/source/shared/ui/Button";

interface Props {
  className?: string;
}

export function StartWorkingButton({ className }: Props) {
  return (
    <Button
      href="#registraciya"
      variant="primary"
      fullWidth
      showArrow
      className={className}
    >
      Начать работать
    </Button>
  );
}
