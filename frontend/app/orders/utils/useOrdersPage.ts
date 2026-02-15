import { useEffect, useRef, useState } from "react";
import { createResponseForOrder } from "@/app/responses/store/api";
import { mapOrderToCardViewModel } from "../store/mappers";
import { useOrdersState } from "../store/state";
import type { OrderCardViewModel, OrderResponse } from "../store/types";
import {
  buildCreateResponsePayload,
  clamp,
  fetchInitialOrdersData,
  fetchMoreOrdersData,
  getNormalizedWheelDelta,
  hasReachedHorizontalEnd,
} from "./ordersPage.utils";
import { useOrdersWebSocket } from "./useOrdersWebSocket";

const PAGE_LIMIT = 50;

export function useOrdersPage() {
  const {
    items,
    total,
    isLoading,
    error,
    setLoading,
    setError,
    setOrders,
    appendOrders,
    setTotal,
    prependOrder,
    updateOrder,
    removeOrder,
  } = useOrdersState();

  useOrdersWebSocket({
    onCreated: (order: OrderResponse) => prependOrder(mapOrderToCardViewModel(order)),
    onUpdated: (order: OrderResponse) => updateOrder(mapOrderToCardViewModel(order)),
    onRemoved: (id: number) => removeOrder(id),
  });

  const ordersRef = useRef<HTMLDivElement | null>(null);
  const loadMoreSentinelRef = useRef<HTMLDivElement | null>(null);
  const isLoadingMoreRef = useRef(false);

  const [selectedOrder, setSelectedOrder] = useState<OrderCardViewModel | null>(null);
  const [isResponding, setIsResponding] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const hasMoreOrders = items.length < total;

  const fetchOrdersData = () =>
    fetchInitialOrdersData({
      pageLimit: PAGE_LIMIT,
      setLoading,
      setError,
      setOrders,
      setTotal,
    });

  const loadMoreOrders = async () => {
    if (isLoading || isLoadingMore || isLoadingMoreRef.current || !hasMoreOrders) {
      return;
    }

    isLoadingMoreRef.current = true;
    setIsLoadingMore(true);

    try {
      await fetchMoreOrdersData({
        skip: items.length,
        pageLimit: PAGE_LIMIT,
        appendOrders,
        setTotal,
        setError,
      });
    } finally {
      isLoadingMoreRef.current = false;
      setIsLoadingMore(false);
    }
  };

  const maybeLoadMore = () => {
    const element = ordersRef.current;
    if (!element) {
      return;
    }

    const reachedEnd = hasReachedHorizontalEnd(element.scrollLeft, element.clientWidth, element.scrollWidth);

    if (reachedEnd) {
      void loadMoreOrders();
    }
  };

  const handleOrdersWheel = (event: { deltaX: number; deltaY: number; deltaMode: number; preventDefault: () => void }) => {
    const element = ordersRef.current;
    if (!element) {
      return;
    }

    const maxScroll = element.scrollWidth - element.clientWidth;
    if (maxScroll <= 0) {
      return;
    }

    event.preventDefault();

    const delta = getNormalizedWheelDelta({
      deltaX: event.deltaX,
      deltaY: event.deltaY,
      deltaMode: event.deltaMode,
      containerWidth: element.clientWidth,
    });

    element.scrollLeft = clamp(element.scrollLeft + delta, 0, maxScroll);
    maybeLoadMore();
  };

  const handleRespondToOrder = async (order: OrderCardViewModel) => {
    setIsResponding(true);

    try {
      await createResponseForOrder(order.id, buildCreateResponsePayload(order));
      setSelectedOrder(null);
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Не удалось отправить отклик";
      setError(message);
    } finally {
      setIsResponding(false);
    }
  };

  useEffect(() => {
    void fetchOrdersData();
  }, []);

  useEffect(() => {
    const element = ordersRef.current;
    if (!element) {
      return;
    }

    const handleWheelScroll = (event: WheelEvent) => {
      handleOrdersWheel(event);
    };

    const handleScroll = () => {
      maybeLoadMore();
    };

    element.addEventListener("wheel", handleWheelScroll, { passive: false, capture: true });
    element.addEventListener("scroll", handleScroll);

    return () => {
      element.removeEventListener("wheel", handleWheelScroll, { capture: true });
      element.removeEventListener("scroll", handleScroll);
    };
  }, [isLoading, isLoadingMore, hasMoreOrders, items.length, total]);

  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth >= 768) {
      return;
    }

    const sentinel = loadMoreSentinelRef.current;
    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadMoreOrders();
        }
      },
      {
        root: null,
        rootMargin: "200px 0px",
        threshold: 0,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [isLoading, isLoadingMore, hasMoreOrders, items.length, total]);

  return {
    items,
    isLoading,
    error,
    isLoadingMore,
    selectedOrder,
    isResponding,
    ordersRef,
    loadMoreSentinelRef,
    fetchOrdersData,
    setSelectedOrder,
    handleRespondToOrder,
    handleOrdersWheel,
  };
}
