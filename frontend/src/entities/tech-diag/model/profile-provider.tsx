"use client";

import { createContext, useContext, useReducer } from "react";
import type { Dispatch, ReactNode } from "react";
import {
  createTechDiagProfileState,
  techDiagProfileReducer,
} from "./profile-state";
import type {
  TechDiagProfileAction,
  TechDiagProfileState,
} from "./profile-state";
import type { TechDiagProfile } from "./types";

/** Сохранённая анкета и события операций с её сведениями и документами. */
interface TechDiagProfileContextValue {
  state: TechDiagProfileState;
  dispatch: Dispatch<TechDiagProfileAction>;
}

/** Загруженная анкета специалиста НК и компоненты её редактора. */
interface TechDiagProfileProviderProps {
  initialProfile: TechDiagProfile;
  children: ReactNode;
}

const TechDiagProfileContext = createContext<TechDiagProfileContextValue | null>(null);

/** Хранит подтверждённые сведения и документы одного специалиста НК. */
export function TechDiagProfileProvider({
  initialProfile,
  children,
}: TechDiagProfileProviderProps) {
  const [state, dispatch] = useReducer(
    techDiagProfileReducer,
    initialProfile,
    createTechDiagProfileState,
  );

  return (
    <TechDiagProfileContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </TechDiagProfileContext.Provider>
  );
}

/** Даёт операции доступ к сохранённой анкете специалиста НК. */
export function useTechDiagProfileContext() {
  const context = useContext(TechDiagProfileContext);

  if (!context) {
    throw new Error("Анкета должна находиться внутри TechDiagProfileProvider.");
  }

  return context;
}

/** Возвращает сохранённую анкету и выполняемую операцию. */
export function useTechDiagProfile() {
  return useTechDiagProfileContext().state;
}
