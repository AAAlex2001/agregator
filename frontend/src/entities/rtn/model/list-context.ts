"use client";

import { createContext, useContext } from "react";
import type { Dispatch } from "react";
import type { RtnListAction, RtnListState } from "./list-state";

/** Фильтры, данные и обновление одной выдачи каталога. */
interface RtnListContextValue {
  filters: string;
  state: RtnListState;
  dispatch: Dispatch<RtnListAction>;
}

export const RtnListContext = createContext<RtnListContextValue | null>(null);

/** Даёт загрузчику доступ к состоянию текущей выдачи. */
export function useRtnListContext() {
  const context = useContext(RtnListContext);

  if (!context) {
    throw new Error("Каталог РТН должен находиться внутри RtnListProvider");
  }

  return context;
}

/** Возвращает разъяснения и состояние загрузки для карточек и кнопки догрузки. */
export function useRtnList() {
  return useRtnListContext().state;
}
