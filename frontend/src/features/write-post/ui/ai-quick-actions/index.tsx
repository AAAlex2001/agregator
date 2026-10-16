"use client";

import { useEditorState } from "@tiptap/react";
import type { Editor } from "@tiptap/react";
import { AI_ACTIONS } from "../../config/ai-actions";
import type { AiAssistant } from "../../model/types";
import styles from "./style.module.scss";

/** Редактор, состояние ИИ-помощника и блокировка на время сохранения. */
interface AiQuickActionsProps {
  editor: Editor;
  assistant: AiAssistant;
  disabled: boolean;
}

/** Готовые просьбы к ИИ над уже написанным текстом. */
export function AiQuickActions({ editor, assistant, disabled }: AiQuickActionsProps) {
  const isEmpty = useEditorState({
    editor,
    selector: ({ editor: current }) => current.isEmpty,
  });
  const isLocked = disabled || assistant.isPending || isEmpty;

  return (
    <div className={styles.quick}>
      <p className={styles.label}>Быстрые действия</p>
      <div className={styles.actions}>
        {AI_ACTIONS.map((action) => (
          <button
            key={action.label}
            type="button"
            disabled={isLocked}
            onClick={() => assistant.ask(editor, action.instruction)}
          >
            <span
              className={styles.dot}
              aria-hidden="true"
            />
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
