"use client";

import { createContext, useContext, useReducer } from "react";
import type { Dispatch, ReactNode } from "react";
import {
  createResearchProfileState,
  researchProfileReducer,
} from "./profile-state";
import type { ResearchProfileAction, ResearchProfileState } from "./profile-state";
import type { ResearchProfile } from "./types";

/** Сохранённая анкета и события её обновления для операций сущности. */
interface ResearchProfileContextValue {
  state: ResearchProfileState;
  dispatch: Dispatch<ResearchProfileAction>;
}

/** Загруженная анкета и форма её редактирования. */
interface ResearchProfileProviderProps {
  initialProfile: ResearchProfile;
  children: ReactNode;
}

const ResearchProfileContext = createContext<ResearchProfileContextValue | null>(null);

/** Хранит подтверждённую сервером анкету одного исследователя. */
export function ResearchProfileProvider({
  initialProfile,
  children,
}: ResearchProfileProviderProps) {
  const [state, dispatch] = useReducer(
    researchProfileReducer,
    initialProfile,
    createResearchProfileState,
  );

  return (
    <ResearchProfileContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </ResearchProfileContext.Provider>
  );
}

/** Даёт операции сохранения доступ к состоянию анкеты. */
export function useResearchProfileContext() {
  const context = useContext(ResearchProfileContext);

  if (!context) {
    throw new Error("Анкета должна находиться внутри ResearchProfileProvider.");
  }

  return context;
}

/** Возвращает сохранённую анкету и состояние её записи. */
export function useResearchProfile() {
  return useResearchProfileContext().state;
}
