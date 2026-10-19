"use client";

import { useEffect, useState } from "react";
import { getTemplates } from "../api/get-templates";
import type { PostTemplate } from "./types";

/** Шаблоны из ответа, ошибка и загружены ли они. */
interface TemplatesState {
  templates: PostTemplate[];
  error: string | null;
  isLoaded: boolean;
}

/** Свои шаблоны; список меняется сразу после сохранения или удаления. */
export function useTemplates() {
  const [state, setState] = useState<TemplatesState>({
    templates: [],
    error: null,
    isLoaded: false,
  });

  useEffect(() => {
    let isActive = true;

    getTemplates()
      .then((templates) => {
        if (isActive) {
          setState({ templates, error: null, isLoaded: true });
        }
      })
      .catch((error) => {
        if (isActive) {
          setState({
            templates: [],
            error: error instanceof Error ? error.message : "Не удалось загрузить шаблоны",
            isLoaded: true,
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  /** Добавляет сохранённый шаблон в начало списка. */
  function addTemplate(template: PostTemplate) {
    setState((current) => ({ ...current, templates: [template, ...current.templates] }));
  }

  /** Убирает удалённый шаблон из списка. */
  function removeTemplate(id: number) {
    setState((current) => ({
      ...current,
      templates: current.templates.filter((template) => template.id !== id),
    }));
  }

  return {
    templates: state.templates,
    error: state.error,
    isLoading: !state.isLoaded,
    addTemplate,
    removeTemplate,
  };
}
