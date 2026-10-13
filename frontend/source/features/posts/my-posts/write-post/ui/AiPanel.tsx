"use client";

import { useEditorState, type Editor } from "@tiptap/react";
import Button from "@/source/shared/ui/Button";
import { TextInput } from "@/source/shared/ui/Inputs";
import { SendIcon } from "@/source/features/posts/editor/icons";
import { AI_ACTIONS } from "../lib/aiActions";
import { useAiPanel } from "../model/useAiPanel";
import s from "./AiPanel.module.scss";

/** Просьба к ИИ и быстрые действия с текстом публикации. */
export function AiPanel({
  editor,
  onBusyChange,
  disabled = false,
}: {
  editor: Editor;
  onBusyChange: (busy: boolean) => void;
  disabled?: boolean;
}) {
  const panel = useAiPanel(editor, onBusyChange);
  const empty = useEditorState({
    editor,
    selector: ({ editor: current }) => current.isEmpty,
  });
  return (
    <section className={s.panel} aria-label="ИИ-помощник">
      <div className={s.bar}>
        <TextInput
          className={s.prompt}
          value={panel.instruction}
          aria-label="Просьба к ИИ"
          placeholder={
            empty
              ? "Опишите, о чём написать пост…"
              : "Напишите, что нужно сделать с текстом…"
          }
          maxLength={1000}
          disabled={disabled || panel.pending}
          onChange={(event) => panel.setInstruction(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              void panel.run(panel.instruction);
            }
          }}
        />
        <button
          type="button"
          aria-label="Отправить просьбу к ИИ"
          disabled={disabled || panel.pending || !panel.instruction.trim()}
          onClick={() => panel.run(panel.instruction)}
        >
          <SendIcon />
        </button>
      </div>
      <div className={s.quick}>
        <p className={s.label}>Быстрые действия</p>
        <div className={s.actions}>
          {AI_ACTIONS.map(({ label, instruction }) => (
            <button
              key={label}
              type="button"
              disabled={disabled || empty || panel.pending}
              onClick={() => panel.run(instruction)}
            >
              <span className={s.dot} aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      </div>
      {panel.pending && (
        <p className={s.status} role="status">
          ИИ пишет текст, обычно это занимает до минуты…
        </p>
      )}
      {panel.error && (
        <p className={s.error} role="alert">
          {panel.error}
        </p>
      )}
      {panel.applied && !panel.pending && (
        <div className={s.applied}>
          <p className={s.status}>Текст заменён ответом ИИ.</p>
          <Button
            variant="transparent"
            disabled={disabled}
            onClick={panel.undo}
          >
            Вернуть как было
          </Button>
        </div>
      )}
    </section>
  );
}
