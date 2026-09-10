"use client";

import { useRouter } from "next/navigation";
import { useEffect, useReducer } from "react";
import { loadClarification, saveClarification } from "./api";
import { EMPTY_CLARIFICATION, RegulationLink, RtnClarificationOut, toOut } from "./model";

type TaxonomyDimension = "oversightAreas" | "industries" | "activities" | "objectTypes";

type Errors = { title?: string; slug?: string };

type State = {
  fields: RtnClarificationOut;
  errors: Errors;
  isLoaded: boolean;
  isSaving: boolean;
  errorMessage: string | null;
};

type SetFieldAction = {
  [Field in keyof RtnClarificationOut]: {
    type: "SET_FIELD";
    field: Field;
    value: RtnClarificationOut[Field];
  };
}[keyof RtnClarificationOut];

type Action =
  | SetFieldAction
  | { type: "TOGGLE_TAXONOMY"; dimension: TaxonomyDimension; value: string }
  | { type: "TOGGLE_TAG"; name: string }
  | { type: "SET_REGULATIONS"; regulations: RegulationLink[] }
  | { type: "LOADED"; fields: RtnClarificationOut }
  | { type: "SET_ERRORS"; errors: Errors }
  | { type: "SAVING" }
  | { type: "SAVE_ERROR"; message: string };

const makeInitial = (isNew: boolean): State => ({
  fields: EMPTY_CLARIFICATION,
  errors: {},
  isLoaded: isNew,
  isSaving: false,
  errorMessage: null,
});

const toggleInArray = (list: string[], value: string): string[] =>
  list.includes(value) ? list.filter((item) => item !== value) : [...list, value];

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        fields: { ...state.fields, [action.field]: action.value },
        errors: { ...state.errors, [action.field]: undefined },
      };
    case "TOGGLE_TAXONOMY":
      return {
        ...state,
        fields: {
          ...state.fields,
          [action.dimension]: toggleInArray(state.fields[action.dimension], action.value),
        },
      };
    case "TOGGLE_TAG":
      return { ...state, fields: { ...state.fields, tags: toggleInArray(state.fields.tags, action.name) } };
    case "SET_REGULATIONS":
      return { ...state, fields: { ...state.fields, referencedRegulations: action.regulations } };
    case "LOADED":
      return { ...state, fields: action.fields, isLoaded: true };
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

const validate = (fields: RtnClarificationOut): Errors => {
  const errors: Errors = {};
  if (!fields.title.trim()) errors.title = "Введите заголовок";
  if (!fields.slug.trim()) errors.slug = "Введите slug";
  return errors;
};

export const useRtnClarificationForm = (id: number | null, answeredQuestionId: number | null = null) => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, id === null, makeInitial);

  useEffect(() => {
    if (id === null) return;
    loadClarification(id)
      .then((c) => dispatch({ type: "LOADED", fields: toOut(c) }))
      .catch((e) => {
        if (e instanceof Error && e.message === "UNAUTHORIZED") router.replace("/login");
        else dispatch({ type: "SAVE_ERROR", message: "Не удалось загрузить разъяснение" });
      });
  }, [id, router]);

  const setField = <Field extends keyof RtnClarificationOut>(
    field: Field,
    value: RtnClarificationOut[Field],
  ) => dispatch({ type: "SET_FIELD", field, value } as SetFieldAction);
  const toggleTaxonomy = (dimension: TaxonomyDimension, value: string) =>
    dispatch({ type: "TOGGLE_TAXONOMY", dimension, value });
  const toggleTag = (name: string) => dispatch({ type: "TOGGLE_TAG", name });
  const setRegulations = (regulations: RegulationLink[]) => dispatch({ type: "SET_REGULATIONS", regulations });

  const submit = async () => {
    const errors = validate(state.fields);
    if (Object.keys(errors).length > 0) {
      dispatch({ type: "SET_ERRORS", errors });
      return;
    }
    dispatch({ type: "SAVING" });
    try {
      await saveClarification(id, state.fields, answeredQuestionId);
      router.push("/rtn");
      router.refresh();
    } catch (e) {
      if (e instanceof Error && e.message === "UNAUTHORIZED") return router.replace("/login");
      dispatch({ type: "SAVE_ERROR", message: e instanceof Error ? e.message : "Не удалось сохранить" });
    }
  };

  return { state, setField, toggleTaxonomy, toggleTag, setRegulations, submit };
};
