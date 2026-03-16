import { useEffect, useRef, useState } from "react";
import { createCustomerOrder } from "../store/api";
import { loadCustomerOrders } from "../store/actions";
import { useCustomerOrdersState } from "../store/state";
import { clamp, getNormalizedWheelDelta } from "@/app/expert/orders/utils/ordersPage.utils";
import { useUserProfile } from "@/app/hooks/useUserProfile";

function parseBudgetToKopecks(value: string): number {
  const cleaned = value.replace(/[^\d.,]/g, "").replace(",", ".");
  const parsed = parseFloat(cleaned);
  if (isNaN(parsed) || parsed <= 0) return 0;
  return Math.round(parsed * 100);
}

const PAGE_LIMIT = 50;

export function useCustomerOrdersPage() {
  const { profile } = useUserProfile();
  const {
    items,
    total,
    isLoading,
    error,
    setLoading,
    setError,
    setOrders,
    setTotal,
    prependOrder,
  } = useCustomerOrdersState();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const ordersRef = useRef<HTMLDivElement | null>(null);
  const scrollTargetRef = useRef<number | null>(null);
  const scrollAnimationRef = useRef<number | null>(null);

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
        return;
      }

      element.scrollLeft += distance * 0.22;
      scrollAnimationRef.current = requestAnimationFrame(animate);
    };

    scrollAnimationRef.current = requestAnimationFrame(animate);
  };

  const fetchOrders = () =>
    loadCustomerOrders({
      pageLimit: PAGE_LIMIT,
      setLoading,
      setError,
      setOrders,
      setTotal,
    });

  const handleCreateOrder = async (data: {
    title: string;
    company: string;
    deadline: string;
    responsesDeadline: string;
    budget: string;
    selectedBadges: { text: string; variant: string }[];
    typicalNames: string;
    comment: string;
    files: File[];
  }) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const sumAmount = parseBudgetToKopecks(data.budget);
      if (sumAmount <= 0) {
        setError("Укажите корректный бюджет");
        return;
      }

      await createCustomerOrder({
        title: data.title,
        company: data.company,
        typical_names: data.typicalNames,
        comment: data.comment,
        customer_id: profile?.id ?? 0,
        sum_amount: sumAmount,
        deadline: data.deadline,
        responses_deadline: data.responsesDeadline || undefined,
        badges: data.selectedBadges,
        files: data.files,
      });

      setShowCreateForm(false);
      await fetchOrders();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Не удалось создать заказ";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    void fetchOrders();
  }, []);

  useEffect(() => {
    const element = ordersRef.current;
    if (!element) {
      return;
    }

    const handleWheel = (event: WheelEvent) => {
      const maxScroll = element.scrollWidth - element.clientWidth;
      if (maxScroll <= 0) {
        return;
      }

      if (!event.shiftKey) {
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

    element.addEventListener("wheel", handleWheel, { passive: false, capture: true });
    return () => {
      if (scrollAnimationRef.current !== null) {
        cancelAnimationFrame(scrollAnimationRef.current);
        scrollAnimationRef.current = null;
      }
      element.removeEventListener("wheel", handleWheel, { capture: true });
    };
  }, [isLoading]);

  return {
    items,
    total,
    isLoading,
    error,
    showCreateForm,
    isSubmitting,
    setShowCreateForm,
    handleCreateOrder,
    fetchOrders,
    ordersRef,
  };
}
