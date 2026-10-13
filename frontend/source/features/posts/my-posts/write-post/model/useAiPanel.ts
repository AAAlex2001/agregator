"use client";

import type { Editor } from "@tiptap/react";
import { useEffect, useRef, useState } from "react";
import { writePostWithAi } from "@/source/entities/posts";

/** Заменяет текст ответом ИИ и позволяет вернуть предыдущую версию. */
export function useAiPanel(
  editor: Editor,
  onBusyChange: (busy: boolean) => void,
) {
  const [instruction, setInstruction] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);
  const request = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      request.current?.abort();
      onBusyChange(false);
    };
  }, [onBusyChange]);

  /** Выполняет просьбу и заменяет текст редактора. */
  async function run(text: string) {
    if (!text.trim() || request.current) return;
    const controller = new AbortController();
    request.current = controller;
    setPending(true);
    setError(null);
    onBusyChange(true);
    const before = editor.getHTML();

    try {
      const html = await writePostWithAi(
        text.trim(),
        editor.isEmpty ? "" : before,
        controller.signal,
      );
      if (controller.signal.aborted || editor.isDestroyed) return;
      const parsed = new DOMParser().parseFromString(html, "text/html");
      if ((parsed.body.textContent ?? "").length > 5000)
        throw new Error(
          "Текст длиннее лимита. Попросите ИИ сделать его короче",
        );
      editor.commands.setContent(html, { emitUpdate: true });
      setPrevious(before);
      setInstruction("");
    } catch (failure) {
      if (!controller.signal.aborted)
        setError(
          failure instanceof Error
            ? failure.message
            : "Не удалось получить ответ ИИ",
        );
    } finally {
      request.current = null;
      if (!controller.signal.aborted) {
        setPending(false);
        onBusyChange(false);
      }
    }
  }

  /** Возвращает текст, который был до ответа ИИ. */
  function undo() {
    if (previous === null) return;
    editor.commands.setContent(previous, { emitUpdate: true });
    setPrevious(null);
  }

  return {
    instruction,
    setInstruction,
    pending,
    error,
    applied: previous !== null,
    run,
    undo,
  };
}
