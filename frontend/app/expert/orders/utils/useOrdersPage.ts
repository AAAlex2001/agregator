import { useEffect, useRef, useState } from "react";
import { createResponseForOrder } from "@/app/expert/responses/store/api";
import type { Step2FormData } from "../components/OrderDetailsModal/types";
import { mapOrderToCardViewModel } from "../store/mappers";
import { useOrdersState } from "../store/state";
import type { OrderCardViewModel, OrderResponse } from "../store/types";
import {
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
  const scrollTargetRef = useRef<number | null>(null);
  const scrollAnimationRef = useRef<number | null>(null);

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

  const startSmoothHorizontalScroll = () => {
    if (scrollAnimationRef.current !== null) {
      return;
    }

    const animate = () => {
      const element = ordersRef.current;
      if (!element) {
        scrollAnimationRef.current = null;
        return;
      }

      const target = scrollTargetRef.current ?? element.scrollLeft;
      const distance = target - element.scrollLeft;

      if (Math.abs(distance) < 0.5) {
        element.scrollLeft = target;
        scrollAnimationRef.current = null;
        maybeLoadMore();
        return;
      }

      element.scrollLeft += distance * 0.22;
      maybeLoadMore();
      scrollAnimationRef.current = requestAnimationFrame(animate);
    };

    scrollAnimationRef.current = requestAnimationFrame(animate);
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

    if (!(event as WheelEvent).shiftKey) {
      return;
    }

    if (event.deltaX === 0 && Math.abs(event.deltaY) > 0) {
      const atStart = element.scrollLeft <= 0;
      const atEnd = element.scrollLeft >= maxScroll - 1;
      if (atStart || atEnd) {
        return;
      }
    }

    const delta = getNormalizedWheelDelta({
      deltaX: event.deltaX,
      deltaY: event.deltaY,
      deltaMode: event.deltaMode,
      containerWidth: element.clientWidth,
    });

    const currentTarget = scrollTargetRef.current ?? element.scrollLeft;
    const nextTarget = clamp(currentTarget + delta, 0, maxScroll);

    if (nextTarget === currentTarget) {
      return;
    }

    event.preventDefault();
    scrollTargetRef.current = nextTarget;
    startSmoothHorizontalScroll();
  };

  const handleRespondToOrder = async (order: { id: number }, formData: Step2FormData) => {
    setIsResponding(true);

    try {
      await createResponseForOrder(order.id, {
        comment: formData.comment,
        proposed_sum_amount: formData.costEstimate,
        proposed_deadline: formData.deadline,
        files: formData.files,
      });
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
      if (scrollAnimationRef.current !== null) {
        cancelAnimationFrame(scrollAnimationRef.current);
        scrollAnimationRef.current = null;
      }
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
  };
}
