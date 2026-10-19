"use client";

import { useState } from "react";
import { deleteTemplate, saveTemplate, useTemplates } from "@/entities/post-template";
import { useNotifications } from "@/shared/ui/notifications";

/** Свои шаблоны, название нового и действия: сохранить текущий текст, удалить шаблон. */
export function useTemplateActions() {
  const { showSuccess, showError } = useNotifications();
  const list = useTemplates();
  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  /** Сохраняет текст из редактора шаблоном под введённым названием. */
  async function save(html: string) {
    setIsSaving(true);

    try {
      const template = await saveTemplate(title.trim() || "Без названия", html);
      list.addTemplate(template);
      setTitle("");
      showSuccess("Шаблон сохранён");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось сохранить шаблон");
    } finally {
      setIsSaving(false);
    }
  }

  /** Удаляет шаблон. */
  async function remove(id: number) {
    try {
      await deleteTemplate(id);
      list.removeTemplate(id);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось удалить шаблон");
    }
  }

  return {
    templates: list.templates,
    error: list.error,
    isLoading: list.isLoading,
    title,
    setTitle,
    isSaving,
    save,
    remove,
  };
}
