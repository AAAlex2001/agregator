"use client";

import { useState } from "react";
import Button from "@/source/shared/ui/Button";
import { ReportChangeModal } from "./ReportChangeModal";

interface ReportChangeButtonProps {
  clarificationId: number;
}

/** Кнопка под разъяснением. Окно создаётся заново при каждом открытии — форма всегда пустая. */
export function ReportChangeButton({ clarificationId }: ReportChangeButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="transparent" size="sm" onClick={() => setIsOpen(true)}>
        Сообщить об изменении
      </Button>
      {isOpen && <ReportChangeModal clarificationId={clarificationId} onClose={() => setIsOpen(false)} />}
    </>
  );
}
