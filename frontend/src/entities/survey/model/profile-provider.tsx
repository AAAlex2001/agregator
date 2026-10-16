"use client";

import { createContext, useContext, useReducer } from "react";
import type { Dispatch, ReactNode } from "react";
import {
  createSurveyProfileState,
  surveyProfileReducer,
} from "./profile-state";
import type { SurveyProfileAction, SurveyProfileState } from "./profile-state";
import type { SurveyProfile } from "./types";

/** Сохранённая анкета и события операций со сведениями и документами. */
interface SurveyProfileContextValue {
  state: SurveyProfileState;
  dispatch: Dispatch<SurveyProfileAction>;
}

/** Загруженная анкета изыскателя и компоненты её редактора. */
interface SurveyProfileProviderProps {
  initialProfile: SurveyProfile;
  children: ReactNode;
}

const SurveyProfileContext = createContext<SurveyProfileContextValue | null>(null);

/** Хранит подтверждённые сведения и документы одного изыскателя. */
export function SurveyProfileProvider({
  initialProfile,
  children,
}: SurveyProfileProviderProps) {
  const [state, dispatch] = useReducer(
    surveyProfileReducer,
    initialProfile,
    createSurveyProfileState,
  );

  return (
    <SurveyProfileContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </SurveyProfileContext.Provider>
  );
}

/** Даёт операции доступ к сохранённой анкете изыскателя. */
export function useSurveyProfileContext() {
  const context = useContext(SurveyProfileContext);

  if (!context) {
    throw new Error("Анкета должна находиться внутри SurveyProfileProvider.");
  }

  return context;
}

/** Возвращает сохранённую анкету и выполняемую операцию. */
export function useSurveyProfile() {
  return useSurveyProfileContext().state;
}

