"use client";

import { createContext, useContext, useReducer } from "react";
import type { Dispatch, ReactNode } from "react";
import {
  createForensicProfileState,
  forensicProfileReducer,
} from "./profile-state";
import type { ForensicProfileAction, ForensicProfileState } from "./profile-state";
import type { ForensicProfile } from "./types";

/** Сохранённая анкета и события операций с её полями и файлами. */
interface ForensicProfileContextValue {
  state: ForensicProfileState;
  dispatch: Dispatch<ForensicProfileAction>;
}

/** Загруженная анкета судебного эксперта и компоненты редактора. */
interface ForensicProfileProviderProps {
  initialProfile: ForensicProfile;
  children: ReactNode;
}

const ForensicProfileContext = createContext<ForensicProfileContextValue | null>(null);

/** Хранит подтверждённые сервером сведения и документы одного эксперта. */
export function ForensicProfileProvider({
  initialProfile,
  children,
}: ForensicProfileProviderProps) {
  const [state, dispatch] = useReducer(
    forensicProfileReducer,
    initialProfile,
    createForensicProfileState,
  );

  return (
    <ForensicProfileContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </ForensicProfileContext.Provider>
  );
}

/** Даёт операции доступ к сохранённой анкете судебного эксперта. */
export function useForensicProfileContext() {
  const context = useContext(ForensicProfileContext);

  if (!context) {
    throw new Error("Анкета должна находиться внутри ForensicProfileProvider.");
  }

  return context;
}

/** Возвращает сохранённую анкету и выполняемую операцию. */
export function useForensicProfile() {
  return useForensicProfileContext().state;
}
