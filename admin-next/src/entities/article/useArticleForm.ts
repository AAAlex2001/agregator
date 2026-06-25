"use client";

import { useRouter } from "next/navigation";
import { useEffect, useReducer } from "react";
import { loadArticle, saveArticle } from "./api";
import { ArticleOut, EMPTY_ARTICLE, toOut } from "./model";

type Errors = { title?: string; slug?: string };

type State = {
  fields: ArticleOut;
  tags: string;
  errors: Errors;
  isLoaded: boolean;
  isSaving: boolean;
  errorMessage: string | null;
};

type Action =
  | { type: "SET_FIELD"; field: keyof ArticleOut; value: string }
  | { type: "SET_TAGS"; value: string }
  | { type: "LOADED"; fields: ArticleOut; tags: string }
  | { type: "SET_ERRORS"; errors: Errors }
  | { type: "SAVING" }
  | { type: "SAVE_ERROR"; message: string };

const makeInitial = (isNew: boolean): State => ({
  fields: EMPTY_ARTICLE,
  tags: "",
  errors: {},
  isLoaded: isNew,
  isSaving: false,
  errorMessage: null,
});

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        fields: { ...state.fields, [action.field]: action.value },
        errors: { ...state.errors, [action.field]: undefined },
      };
    case "SET_TAGS":
      return { ...state, tags: action.value };
    case "LOADED":
      return { ...state, fields: action.fields, tags: action.tags, isLoaded: true };
    case "SET_ERRORS":
      return { ...state, errors: action.errors };
    case "SAVING":
      return { ...state, isSaving: true, errorMessage: null };
    case "SAVE_ERROR":
      return { ...state, isSaving: false, errorMessage: action.message };
    default:
      return state;
  }
};

const validate = (fields: ArticleOut): Errors => {
  const errors: Errors = {};
  if (!fields.title.trim()) errors.title = "Введите заголовок";
  if (!fields.slug.trim()) errors.slug = "Введите slug";
  return errors;
};

const parseTags = (text: string) => text.split(",").map((t) => t.trim()).filter(Boolean);

export const useArticleForm = (id: number | null) => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, id === null, makeInitial);

  useEffect(() => {
    if (id === null) return;
    loadArticle(id)
      .then((a) => dispatch({ type: "LOADED", fields: toOut(a), tags: a.tags.join(", ") }))
      .catch((e) => {
        if (e instanceof Error && e.message === "UNAUTHORIZED") router.replace("/login");
        else dispatch({ type: "SAVE_ERROR", message: "Не удалось загрузить статью" });
      });
  }, [id, router]);

  const setField = (field: keyof ArticleOut, value: string) => dispatch({ type: "SET_FIELD", field, value });
  const setTags = (value: string) => dispatch({ type: "SET_TAGS", value });

  const submit = async () => {
    const errors = validate(state.fields);
    if (Object.keys(errors).length > 0) {
      dispatch({ type: "SET_ERRORS", errors });
      return;
    }
    dispatch({ type: "SAVING" });
    try {
      await saveArticle(id, { ...state.fields, tags: parseTags(state.tags) });
      router.push("/");
      router.refresh();
    } catch (e) {
      if (e instanceof Error && e.message === "UNAUTHORIZED") return router.replace("/login");
      dispatch({ type: "SAVE_ERROR", message: e instanceof Error ? e.message : "Не удалось сохранить" });
    }
  };

  return { state, setField, setTags, submit };
};
