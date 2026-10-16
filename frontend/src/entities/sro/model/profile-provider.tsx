"use client";

import { createContext, useContext, useReducer } from "react";
import type { Dispatch, ReactNode } from "react";
import { createSroProfileState, sroProfileReducer } from "./profile-state";
import type { SroProfileAction, SroProfileState } from "./profile-state";
import type { SroDirection, SroProfile } from "./types";

/** Направление, сохранённая анкета и события операций с ней. */
interface SroProfileContextValue {
  direction: SroDirection;
  state: SroProfileState;
  dispatch: Dispatch<SroProfileAction>;
}

/** Загруженная анкета члена СРО и компоненты её редактора. */
interface SroProfileProviderProps {
  direction: SroDirection;
  initialProfile: SroProfile;
  children: ReactNode;
}

const SroProfileContext = createContext<SroProfileContextValue | null>(null);

/** Хранит подтверждённые сведения и документы члена СРО одного направления. */
export function SroProfileProvider({
  direction,
  initialProfile,
  children,
}: SroProfileProviderProps) {
  const [state, dispatch] = useReducer(
    sroProfileReducer,
    initialProfile,
    createSroProfileState,
  );

  return (
    <SroProfileContext.Provider
      value={{
        direction,
        state,
        dispatch,
      }}
    >
      {children}
    </SroProfileContext.Provider>
  );
}

/** Даёт операции доступ к направлению и сохранённой анкете члена СРО. */
export function useSroProfileContext() {
  const context = useContext(SroProfileContext);

  if (!context) {
    throw new Error("Анкета должна находиться внутри SroProfileProvider.");
  }

  return context;
}

/** Возвращает направление, сохранённую анкету и текущую операцию. */
export function useSroProfile() {
  const { direction, state } = useSroProfileContext();

  return {
    direction,
    profile: state.profile,
    operation: state.operation,
  };
}
