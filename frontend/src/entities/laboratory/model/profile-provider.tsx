"use client";

import { createContext, useContext, useReducer } from "react";
import type { Dispatch, ReactNode } from "react";
import {
  createLaboratoryProfileState,
  laboratoryProfileReducer,
} from "./profile-state";
import type { LaboratoryProfileAction, LaboratoryProfileState } from "./profile-state";
import type { LaboratoryProfile } from "./types";

/** Сохранённая анкета и события её обновления. */
interface LaboratoryProfileContextValue {
  state: LaboratoryProfileState;
  dispatch: Dispatch<LaboratoryProfileAction>;
}

/** Загруженные сведения лаборатории и редактор анкеты. */
interface LaboratoryProfileProviderProps {
  initialProfile: LaboratoryProfile;
  children: ReactNode;
}

const LaboratoryProfileContext = createContext<LaboratoryProfileContextValue | null>(null);

/** Хранит подтверждённую сервером анкету лаборатории. */
export function LaboratoryProfileProvider({
  initialProfile,
  children,
}: LaboratoryProfileProviderProps) {
  const [state, dispatch] = useReducer(
    laboratoryProfileReducer,
    initialProfile,
    createLaboratoryProfileState,
  );

  return (
    <LaboratoryProfileContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </LaboratoryProfileContext.Provider>
  );
}

/** Даёт операции сохранения доступ к состоянию анкеты. */
export function useLaboratoryProfileContext() {
  const context = useContext(LaboratoryProfileContext);

  if (!context) {
    throw new Error("Анкета должна находиться внутри LaboratoryProfileProvider.");
  }

  return context;
}

/** Возвращает сохранённые сведения и состояние их записи. */
export function useLaboratoryProfile() {
  return useLaboratoryProfileContext().state;
}
