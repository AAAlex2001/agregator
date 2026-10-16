"use client";

import { useCurrentEditor } from "@tiptap/react";
import type { AiAssistant } from "../../model/types";
import { AiPrompt } from "../ai-prompt";
import { AiQuickActions } from "../ai-quick-actions";
import styles from "./style.module.scss";

/** Состояние ИИ-помощника из формы и блокировка на время сохранения. */
interface AiPanelProps {
  assistant: AiAssistant;
  disabled: boolean;
}

/** Панель ИИ-помощника над редактором: своя просьба и быстрые действия с текстом. */
export function AiPanel({ assistant, disabled }: AiPanelProps) {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <section
      className={styles.panel}
      aria-label="ИИ-помощник"
    >
      <AiPrompt
        editor={editor}
        assistant={assistant}
        disabled={disabled}
      />
      <AiQuickActions
        editor={editor}
        assistant={assistant}
        disabled={disabled}
      />
    </section>
  );
}
