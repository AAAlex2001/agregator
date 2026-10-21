"use client";

import { useState } from "react";

/** Шаги формы: текущий номер, переходы и возврат к пройденным. */
export function useSteps(count: number) {
  const [step, setStep] = useState(0);

  /** Открывает шаг и прокручивает страницу к его началу. */
  function open(next: number) {
    setStep(Math.min(Math.max(next, 0), count - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /** Возвращает к уже пройденному шагу; будущие шаги так не открываются. */
  function goTo(next: number) {
    if (next < step) {
      open(next);
    }
  }

  return {
    step,
    isFirst: step === 0,
    isLast: step === count - 1,
    open,
    goTo,
    back: () => goTo(step - 1),
    forward: () => open(step + 1),
  };
}
