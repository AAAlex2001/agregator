"use client";

import { useEditorState } from "@tiptap/react";
import type { Editor } from "@tiptap/react";
import type { KeyboardEvent } from "react";
import { SendIcon } from "@/shared/ui/icons";
import { Loader } from "@/shared/ui/loader";
import { TextInput } from "@/shared/ui/text-input";
import type { AiAssistant } from "../../model/types";
import styles from "./style.module.scss";

/** Наибольшая длина просьбы к ИИ-помощнику. */
const MAX_INSTRUCTION_LENGTH = 1000;

/** Редактор, состояние ИИ-помощника и блокировка на время сохранения. */
interface AiPromptProps {
  editor: Editor;
  assistant: AiAssistant;
  disabled: boolean;
}

/** Поле своей просьбы к ИИ с кнопкой отправки. */
export function AiPrompt({ editor, assistant, disabled }: AiPromptProps) {
  const isEmpty = useEditorState({
    editor,
    selector: ({ editor: current }) => current.isEmpty,
  });
  const isLocked = disabled || assistant.isPending;
  const canSend = !isLocked && assistant.instruction.trim().length >= 2;
  const placeholder = isEmpty
    ? "Опишите, о чём написать пост…"
    : "Напишите, что нужно сделать с текстом…";

  /** Отправляет свою просьбу к ИИ. */
  function sendInstruction() {
    if (canSend) {
      void assistant.ask(editor, assistant.instruction);
    }
  }

  /** Отправляет просьбу по Enter, не отправляя форму публикации. */
  function sendOnEnter(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    sendInstruction();
  }

  return (
    <div className={styles.bar}>
      <TextInput
        className={styles.prompt}
        value={assistant.instruction}
        aria-label="Просьба к ИИ"
        placeholder={placeholder}
        maxLength={MAX_INSTRUCTION_LENGTH}
        disabled={isLocked}
        onChange={(event) => assistant.setInstruction(event.target.value)}
        onKeyDown={sendOnEnter}
      />
      {assistant.isPending ? (
        <Loader
          className={styles.send}
          size="sm"
          label=""
          ariaLabel="ИИ готовит текст"
        />
      ) : (
        <button
          type="button"
          className={styles.send}
          aria-label="Отправить просьбу к ИИ"
          disabled={!canSend}
          onClick={sendInstruction}
        >
          <SendIcon />
        </button>
      )}
    </div>
  );
}
