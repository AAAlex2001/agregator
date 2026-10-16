"use client";

import { createContext, useContext, useReducer } from "react";
import type { Dispatch, ReactNode } from "react";
import {
  createEcologyProfileState,
  ecologyProfileReducer,
} from "./profile-state";
import type { EcologyProfileAction, EcologyProfileState } from "./profile-state";
import type { EcologyProfile } from "./types";

/** Состояние сохранённой анкеты, общее для её операций. */
interface EcologyProfileContextValue {
  state: EcologyProfileState;
  dispatch: Dispatch<EcologyProfileAction>;
}

/** Загруженная анкета и форма, работающая с её документами. */
interface EcologyProfileProviderProps {
  initialProfile: EcologyProfile;
  children: ReactNode;
}

const EcologyProfileContext = createContext<EcologyProfileContextValue | null>(null);

/** Хранит сохранённые поля и документы одного экземпляра анкеты. */
export function EcologyProfileProvider({
  initialProfile,
  children,
}: EcologyProfileProviderProps) {
  const [state, dispatch] = useReducer(
    ecologyProfileReducer,
    initialProfile,
    createEcologyProfileState,
  );

  return (
    <EcologyProfileContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </EcologyProfileContext.Provider>
  );
}

/** Даёт операциям доступ к сохранённой анкете. */
export function useEcologyProfileContext() {
  const context = useContext(EcologyProfileContext);

  if (!context) {
    throw new Error("Анкета должна находиться внутри EcologyProfileProvider.");
  }

  return context;
}

/** Возвращает сохранённую анкету и выполняемую операцию. */
export function useEcologyProfile() {
  return useEcologyProfileContext().state;
}
