"use client";

import { createContext, useContext, useReducer } from "react";
import type { Dispatch, ReactNode } from "react";
import {
  auditExpertProfileReducer,
  createAuditExpertProfileState,
} from "./profile-state";
import type {
  AuditExpertProfileAction,
  AuditExpertProfileState,
} from "./profile-state";
import type { AuditExpertProfile } from "./types";

/** Сохранённая анкета и события операций с её сведениями и документами. */
interface AuditExpertProfileContextValue {
  state: AuditExpertProfileState;
  dispatch: Dispatch<AuditExpertProfileAction>;
}

/** Загруженная анкета аудитора и компоненты её редактора. */
interface AuditExpertProfileProviderProps {
  initialProfile: AuditExpertProfile;
  children: ReactNode;
}

const AuditExpertProfileContext = createContext<AuditExpertProfileContextValue | null>(null);

/** Хранит подтверждённые сведения и документы одного аудитора. */
export function AuditExpertProfileProvider({
  initialProfile,
  children,
}: AuditExpertProfileProviderProps) {
  const [state, dispatch] = useReducer(
    auditExpertProfileReducer,
    initialProfile,
    createAuditExpertProfileState,
  );

  return (
    <AuditExpertProfileContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </AuditExpertProfileContext.Provider>
  );
}

/** Даёт операции доступ к сохранённой анкете аудитора. */
export function useAuditExpertProfileContext() {
  const context = useContext(AuditExpertProfileContext);

  if (!context) {
    throw new Error("Анкета должна находиться внутри AuditExpertProfileProvider.");
  }

  return context;
}

/** Возвращает сохранённую анкету и выполняемую операцию. */
export function useAuditExpertProfile() {
  return useAuditExpertProfileContext().state;
}
