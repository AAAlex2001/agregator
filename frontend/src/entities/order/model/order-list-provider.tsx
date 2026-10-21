"use client";

import { useEffect, useReducer, useRef } from "react";
import type { ReactNode } from "react";
import { getOrderListPage } from "../api/get-order-list-page";
import { OrderListContext } from "./order-list-context";
import { createOrderListState, orderListReducer } from "./order-list-state";
import { ORDERS_PAGE_SIZE } from "./order-list";
import type { OrderListPage, OrderListType } from "./order-list";

/** Вид списка, исполнитель для его истории, серверная страница с её позицией и размер страницы. */
interface OrderListProviderProps {
  initialPage?: OrderListPage;
  initialOffset?: number;
  pageSize?: number;
  listType?: OrderListType;
  expertPublicId?: string;
  children: ReactNode;
}

/** Хранит список текущей сессии; при смене аккаунта или вида списка нужен новый key. */
export function OrderListProvider({
  initialPage,
  initialOffset = 0,
  pageSize = ORDERS_PAGE_SIZE,
  listType = "orders",
  expertPublicId,
  children,
}: OrderListProviderProps) {
  const [state, dispatch] = useReducer(
    orderListReducer,
    initialPage,
    (page) => createOrderListState(page, initialOffset),
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
            skip: initialOffset,
            limit: pageSize,
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
  }, [initialPage, initialOffset, pageSize, listType, expertPublicId]);

  return (
    <OrderListContext.Provider
      value={{
        state,
        dispatch,
        initialPage,
        initialOffset,
        pageSize,
        listType,
        expertPublicId,
        requestVersionRef,
      }}
    >
      {children}
    </OrderListContext.Provider>
  );
}
