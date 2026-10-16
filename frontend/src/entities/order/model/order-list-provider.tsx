"use client";

import { useEffect, useReducer, useRef } from "react";
import type { ReactNode } from "react";
import { getOrderListPage } from "../api/get-order-list-page";
import { OrderListContext } from "./order-list-context";
import { createOrderListState, orderListReducer } from "./order-list-state";
import { ORDERS_PAGE_SIZE } from "./order-list";
import type { OrderListPage, OrderListType } from "./order-list";

/** Вид списка, исполнитель для его истории, серверная страница и отображение. */
interface OrderListProviderProps {
  initialPage?: OrderListPage;
  listType?: OrderListType;
  expertPublicId?: string;
  children: ReactNode;
}

/** Хранит список текущей сессии; при смене аккаунта или вида списка нужен новый key. */
export function OrderListProvider({
  initialPage,
  listType = "orders",
  expertPublicId,
  children,
}: OrderListProviderProps) {
  const [state, dispatch] = useReducer(
    orderListReducer,
    initialPage,
    createOrderListState,
  );
  const requestVersionRef = useRef(0);

  useEffect(() => {
    if (initialPage) {
      return;
    }

    const requestVersion = ++requestVersionRef.current;

    /** Загружает первую страницу только для этого экземпляра списка. */
    async function loadFirstPage() {
      try {
        const page = await getOrderListPage(
          {
            skip: 0,
            limit: ORDERS_PAGE_SIZE,
            sort: {
              field: null,
              direction: null,
            },
          },
          listType,
          expertPublicId,
        );

        if (requestVersion === requestVersionRef.current) {
          dispatch({
            type: "page/loaded",
            page,
          });
        }
      } catch (error) {
        if (requestVersion === requestVersionRef.current) {
          dispatch({
            type: "request/failed",
            error: error instanceof Error
              ? error.message
              : "Не удалось загрузить заказы",
          });
        }
      }
    }

    void loadFirstPage();

    return () => {
      requestVersionRef.current += 1;
    };
  }, [initialPage, listType, expertPublicId]);

  return (
    <OrderListContext.Provider
      value={{
        state,
        dispatch,
        initialPage,
        listType,
        expertPublicId,
        requestVersionRef,
      }}
    >
      {children}
    </OrderListContext.Provider>
  );
}
