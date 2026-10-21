"use client";

import { useState } from "react";

/** Где показан мастер: на странице переход прокручивает её к началу, в окне — нет. */
type StepsPlace = "page" | "dialog";

/** Шаги формы: текущий номер, переходы и возврат к пройденным. */
export function useSteps(count: number, place: StepsPlace = "page") {
  const [step, setStep] = useState(0);

  /** Открывает шаг; на странице прокручивает её к началу шага. */
  function open(next: number) {
    setStep(Math.min(Math.max(next, 0), count - 1));

    if (place === "page") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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