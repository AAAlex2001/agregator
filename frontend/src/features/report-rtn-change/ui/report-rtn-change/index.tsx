"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { ReportRtnChangeDialog } from "../report-rtn-change-dialog";

/** Разъяснение, о котором пользователь может сообщить модератору. */
interface ReportRtnChangeProps {
  clarificationId: number;
}

/** Открывает новую пустую форму сообщения при каждом нажатии кнопки. */
export function ReportRtnChange({ clarificationId }: ReportRtnChangeProps) {
  const [isOpen, setIsOpen] = useState(false);

  /** Открывает диалог сообщения. */
  function openDialog() {
    setIsOpen(true);
  }

  /** Закрывает диалог и удаляет состояние заполненной формы. */
  function closeDialog() {
    setIsOpen(false);
  }

  return (
    <>
      <Button
        variant="transparent"
        size="sm"
        onClick={openDialog}
      >
        Сообщить об изменении
      </Button>
      {isOpen && (
        <ReportRtnChangeDialog
          clarificationId={clarificationId}
          onClose={closeDialog}
        />
      )}
    </>
  );
}
