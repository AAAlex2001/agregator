"use client";

import { useEditorState, type Editor } from "@tiptap/react";
import { TextInput } from "@/source/shared/ui/Inputs";
import Loader from "@/source/shared/ui/Loader";
import { AI_ACTIONS } from "../lib/aiActions";
import type { AiAssistant } from "../model/useAiAssistant";
import { SendIcon } from "./icons";
import s from "./AiPanel.module.scss";

const MAX_INSTRUCTION_LENGTH = 1000;

interface AiPanelProps {
  editor: Editor;
  assistant: AiAssistant;
  disabled: boolean;
}

/** Своя просьба к ИИ и быстрые действия с текстом публикации. */
export function AiPanel({ editor, assistant, disabled }: AiPanelProps) {
  const isEmpty = useEditorState({
    editor,
    selector: ({ editor: current }) => current.isEmpty,
  });
  const isLocked = disabled || assistant.isPending;
  const canSend = !isLocked && assistant.instruction.trim().length >= 2;
  const placeholder = isEmpty
    ? "Опишите, о чём написать пост…"
    : "Напишите, что нужно сделать с текстом…";

  return (
    <section className={s.panel} aria-label="ИИ-помощник">
      <div className={s.bar}>
        <TextInput
          className={s.prompt}
          value={assistant.instruction}
          aria-label="Просьба к ИИ"
          placeholder={placeholder}
          maxLength={MAX_INSTRUCTION_LENGTH}
          disabled={isLocked}
          onChange={(event) => assistant.setInstruction(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== "Enter") {
              return;
            }

            event.preventDefault();
            if (canSend) {
              void assistant.ask(editor, assistant.instruction);
            }
          }}
        />
        {assistant.isPending ? (
          <Loader
            className={s.send}
            size="sm"
            label=""
            ariaLabel="ИИ готовит текст"
          />
        ) : (
          <button
            type="button"
            className={s.send}
            aria-label="Отправить просьбу к ИИ"
            disabled={!canSend}
            onClick={() => assistant.ask(editor, assistant.instruction)}
          >
            <SendIcon />
          </button>
        )}
      </div>
      <div className={s.quick}>
        <p className={s.label}>Быстрые действия</p>
        <div className={s.actions}>
          {AI_ACTIONS.map((action) => (
            <button
              key={action.label}
              type="button"
              disabled={isLocked || isEmpty}
              onClick={() => assistant.ask(editor, action.instruction)}
            >
              <span className={s.dot} aria-hidden="true" />
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
