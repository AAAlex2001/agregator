"use client";

import { createContext, useContext, useEffect, useReducer } from "react";
import type { Dispatch, ReactNode } from "react";
import { getOrderQuestions } from "../api/get-order-questions";
import { createOrderQuestionsState, orderQuestionsReducer } from "./questions-state";
import type { OrderQuestionsAction, OrderQuestionsState } from "./questions-state";

/** Один заказ, его вопросы и события предметных операций. */
interface OrderQuestionsContextValue {
  orderId: number;
  state: OrderQuestionsState;
  dispatch: Dispatch<OrderQuestionsAction>;
}

/** Заказ и компоненты его вопросов; при смене заказа нужен новый экземпляр. */
interface OrderQuestionsProviderProps {
  orderId: number;
  children: ReactNode;
}

const OrderQuestionsContext = createContext<OrderQuestionsContextValue | null>(null);

/** Загружает вопросы заказа и объединяет состояние отдельных действий над ними. */
export function OrderQuestionsProvider({
  orderId,
  children,
}: OrderQuestionsProviderProps) {
  const [state, dispatch] = useReducer(
    orderQuestionsReducer,
    undefined,
    createOrderQuestionsState,
  );

  useEffect(() => {
    let isActive = true;

    getOrderQuestions(orderId)
      .then((list) => {
        if (isActive) {
          dispatch({
            type: "load/succeeded",
            items: list.items,
          });
        }
      })
      .catch((error) => {
        if (isActive) {
          dispatch({
            type: "load/failed",
            error: error instanceof Error ? error.message : "Не удалось загрузить вопросы",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, [orderId]);

  return (
    <OrderQuestionsContext.Provider
      value={{
        orderId,
        state,
        dispatch,
      }}
    >
      {children}
    </OrderQuestionsContext.Provider>
  );
}

/** Даёт предметной операции доступ к вопросам выбранного заказа. */
export function useOrderQuestionsContext() {
  const context = useContext(OrderQuestionsContext);

  if (!context) {
    throw new Error("Вопросы должны находиться внутри OrderQuestionsProvider.");
  }

  return context;
}

/** Возвращает вопросы и состояние загрузки или отправки для интерфейса. */
export function useOrderQuestions() {
  return useOrderQuestionsContext().state;
}
