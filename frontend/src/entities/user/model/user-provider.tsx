"use client";

import { createContext, useContext, useEffect, useReducer, useRef } from "react";
import type { Dispatch, ReactNode, RefObject } from "react";
import { loadUserProfile } from "./load-user-profile";
import { createUserState, userReducer } from "./reducer";
import type { UserAction, UserRole, UserState } from "./types";

/** Состояние пользователя, его события и номер последнего запроса профиля. */
interface UserContextValue {
  state: UserState;
  dispatch: Dispatch<UserAction>;
  profileRequestVersionRef: RefObject<number>;
}

/** Роль из cookie для первого рендера и содержимое приложения. */
interface UserProviderProps {
  initialRole?: UserRole | null;
  children: ReactNode;
}

const UserContext = createContext<UserContextValue | null>(null);

/** Хранит текущего пользователя и восстанавливает его сессию при открытии приложения. */
export function UserProvider({ initialRole = null, children }: UserProviderProps) {
  const [state, dispatch] = useReducer(userReducer, initialRole, createUserState);
  const profileRequestVersionRef = useRef(0);

  useEffect(() => {
    void loadUserProfile(dispatch, profileRequestVersionRef).catch(() => undefined);

    return () => {
      profileRequestVersionRef.current += 1;
    };
  }, []);

  return (
    <UserContext.Provider value={{ state, dispatch, profileRequestVersionRef }}>
      {children}
    </UserContext.Provider>
  );
}

/** Открывает состояние пользователя внутренним операциям сущности. */
export function useUserContext(): UserContextValue {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("Компонент пользователя должен находиться внутри UserProvider");
  }

  return context;
}
