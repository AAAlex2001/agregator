"use client";

import { useEffect, useReducer } from "react";
import { fetchTags, type Tag } from "@/entities/tag";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";
import { createTag, deleteTag, renameTag } from "../api/tags";
import { tagsReducer } from "./reducers";

/** Теги: список, добавление, переименование на месте и удаление через подтверждение. */
export const useTags = () => {
  const toast = useToast();
  const [state, dispatch] = useReducer(tagsReducer, {
    tags: null,
    failed: false,
    draft: "",
    editing: null,
    editingName: "",
    removing: null,
    pending: false,
  });

  useEffect(() => {
    let active = true;

    fetchTags()
      .then((tags) => {
        if (active) dispatch({ type: "load/success", tags });
      })
      .catch(() => {
        if (active) dispatch({ type: "load/error" });
      });

    return () => {
      active = false;
    };
  }, []);

  const request = async (action: () => Promise<void>, fallback: string) => {
    dispatch({ type: "request/start" });

    try {
      await action();
    } catch (failure) {
      toast(errorMessage(failure, fallback), "error");
    } finally {
      dispatch({ type: "request/finish" });
    }
  };

  const changeDraft = (value: string) => dispatch({ type: "draft/change", value });

  const add = () => {
    const name = state.draft.trim();

    if (!name) return;

    request(async () => {
      dispatch({ type: "tag/created", tag: await createTag(name) });
      toast("Тег добавлен");
    }, "Не удалось добавить тег");
  };

  const openEdit = (tag: Tag) => dispatch({ type: "edit/open", tag });
  const changeEditing = (value: string) => dispatch({ type: "edit/change", value });
  const closeEdit = () => dispatch({ type: "edit/close" });

  const rename = () => {
    const name = state.editingName.trim();

    if (!state.editing || !name) return;
    if (name === state.editing.name) return closeEdit();

    const tag = state.editing;

    request(async () => {
      dispatch({ type: "tag/renamed", tag: await renameTag(tag.id, name) });
      toast("Тег переименован");
    }, "Не удалось переименовать тег");
  };

  const askRemove = (tag: Tag) => dispatch({ type: "remove/ask", tag });
  const cancelRemove = () => dispatch({ type: "remove/cancel" });

  const remove = () => {
    const tag = state.removing;

    if (!tag) return;

    request(async () => {
      await deleteTag(tag.id);
      dispatch({ type: "tag/removed", id: tag.id });
      toast("Тег удалён");
    }, "Не удалось удалить тег");
  };

  return { state, changeDraft, add, openEdit, changeEditing, closeEdit, rename, askRemove, cancelRemove, remove };
};
