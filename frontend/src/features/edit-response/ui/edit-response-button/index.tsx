"use client";

import { useState } from "react";
import type { ResponseItem } from "@/entities/response";
import { Button } from "@/shared/ui/button";
import { EditResponseModal } from "../edit-response-modal";

/** Отклик исполнителя и обновление списка после сохранения. */
interface EditResponseButtonProps {
  response: ResponseItem;
  onSaved: () => void;
}

/** Открывает форму изменения предложения с сохранёнными условиями. */
export function EditResponseButton({ response, onSaved }: EditResponseButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  /** Открывает форму с черновиком из сохранённого отклика. */
  function openForm() {
    setIsOpen(true);
  }

  /** Закрывает форму и удаляет несохранённый черновик. */
  function closeForm() {
    setIsOpen(false);
  }

  /** Закрывает форму и обновляет список после сохранения. */
  function finishEditing() {
    setIsOpen(false);
    onSaved();
  }

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        onClick={openForm}
      >
        Изменить предложение
      </Button>
      {isOpen && (
        <EditResponseModal
          response={response}
          onClose={closeForm}
          onSaved={finishEditing}
        />
      )}
    </>
  );
}
