"use client";

import { useReducer } from "react";
import type { ReactNode } from "react";
import { RtnListContext } from "./list-context";
import { createRtnListState, rtnListReducer } from "./list-state";
import type { RtnList } from "./types";

/** Серверная выдача и компоненты каталога с одинаковыми фильтрами. */
interface RtnListProviderProps {
  initial: RtnList;
  filters: string;
  children: ReactNode;
}

/** Хранит выдачу для карточек и догрузки, сохраняя первые записи в серверном HTML. */
export function RtnListProvider({
  initial,
  filters,
  children,
}: RtnListProviderProps) {
  const [state, dispatch] = useReducer(
    rtnListReducer,
    initial,
    createRtnListState,
  );

  return (
    <RtnListContext.Provider value={{ filters, state, dispatch }}>
      {children}
    </RtnListContext.Provider>
  );
}
