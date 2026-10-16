"use client";

import { createContext, useContext, useReducer } from "react";
import type { Dispatch, ReactNode } from "react";
import { createDesignProfileState, designProfileReducer } from "./profile-state";
import type { DesignProfileAction, DesignProfileState } from "./profile-state";
import type { DesignProfile } from "./types";

interface DesignProfileContextValue {
  state: DesignProfileState;
  dispatch: Dispatch<DesignProfileAction>;
}

interface DesignProfileProviderProps {
  initialProfile: DesignProfile;
  children: ReactNode;
}

const DesignProfileContext = createContext<DesignProfileContextValue | null>(null);

/** Хранит сохранённую анкету для формы и операций с документами. */
export function DesignProfileProvider({
  initialProfile,
  children,
}: DesignProfileProviderProps) {
  const [state, dispatch] = useReducer(
    designProfileReducer,
    initialProfile,
    createDesignProfileState,
  );

  return (
    <DesignProfileContext.Provider value={{ state, dispatch }}>
      {children}
    </DesignProfileContext.Provider>
  );
}

/** Даёт операциям анкеты доступ к её состоянию. */
export function useDesignProfileContext() {
  const context = useContext(DesignProfileContext);

  if (!context) {
    throw new Error("Анкета должна находиться внутри DesignProfileProvider.");
  }

  return context;
}

/** Возвращает сохранённую анкету и состояние текущего запроса. */
export function useDesignProfile() {
  return useDesignProfileContext().state;
}
