"use client";

import { Button } from "@/shared/ui/button";
import { scrollToRegistration } from "../../model/scroll-to-registration";

/** Дополнительное оформление кнопки на обложке направления. */
interface ScrollToRegistrationButtonProps {
  className?: string;
}

/** Переводит от описания услуги к выбору роли на этой же странице. */
export function ScrollToRegistrationButton({
  className,
}: ScrollToRegistrationButtonProps) {
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
