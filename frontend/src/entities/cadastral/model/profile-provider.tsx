"use client";

import { createContext, useContext, useReducer } from "react";
import type { Dispatch, ReactNode } from "react";
import {
  cadastralProfileReducer,
  createCadastralProfileState,
} from "./profile-state";
import type { CadastralProfileAction, CadastralProfileState } from "./profile-state";
import type { CadastralProfile } from "./types";

/** Сохранённая анкета и события операций с её полями и документами. */
interface CadastralProfileContextValue {
  state: CadastralProfileState;
  dispatch: Dispatch<CadastralProfileAction>;
}

/** Загруженная анкета и компоненты её редактора. */
interface CadastralProfileProviderProps {
  initialProfile: CadastralProfile;
  children: ReactNode;
}

const CadastralProfileContext = createContext<CadastralProfileContextValue | null>(null);

/** Хранит подтверждённые сервером поля и документы одного инженера. */
export function CadastralProfileProvider({
  initialProfile,
  children,
}: CadastralProfileProviderProps) {
  const [state, dispatch] = useReducer(
    cadastralProfileReducer,
    initialProfile,
    createCadastralProfileState,
  );

  return (
    <CadastralProfileContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </CadastralProfileContext.Provider>
  );
}

/** Даёт операции доступ к сохранённой анкете инженера. */
export function useCadastralProfileContext() {
  const context = useContext(CadastralProfileContext);

  if (!context) {
    throw new Error("Анкета должна находиться внутри CadastralProfileProvider.");
  }

  return context;
}

/** Возвращает сохранённые сведения и состояние текущего запроса. */
export function useCadastralProfile() {
  return useCadastralProfileContext().state;
}
