import { useEffect, useRef, useState } from "react";
import { createCustomerOrder, updateCustomerOrder, deleteCustomerOrder } from "../store/api";
import { loadCustomerOrders } from "../store/actions";
import { useCustomerOrdersState } from "../store/state";
import { clamp, getNormalizedWheelDelta } from "@/app/expert/orders/utils/ordersPage.utils";
import { useUserProfile } from "@/app/hooks/useUserProfile";
import { useNotifications } from "@/app/components/Notifications";
import { getDraft, saveDraft, clearDraft } from "../store/draft";
import type { CustomerOrderCardVM } from "../store/types";
import type { OrderInitialData } from "../components/CreateOrderForm/CreateOrderForm";
import { BADGE_OPTIONS } from "../components/CreateOrderForm/sections";

function parseBudgetToKopecks(value: string): number {
  const cleaned = value.replace(/[^\d.,]/g, "").replace(",", ".");
  const parsed = parseFloat(cleaned);
  if (isNaN(parsed) || parsed <= 0) return 0;
  return Math.round(parsed * 100);
}

function toIsoWithTimezone(localDatetime: string): string {
  if (!localDatetime) return "";
  const d = new Date(localDatetime);
  if (isNaN(d.getTime())) return localDatetime;
  return d.toISOString();
}

function buildInitialDataFromOrder(order: CustomerOrderCardVM): OrderInitialData {
  const selectedVariants: string[] = [];
  const typicalNamesMap: Record<string, string> = {};

  for (const badge of order.badgesRaw) {
    const variant = badge.variant;
    if (!selectedVariants.includes(variant)) {
      selectedVariants.push(variant);
    }
    const opt = BADGE_OPTIONS.find((b) => b.variant === variant);
    if (opt) {
      const prefix = opt.text + " ";
      const name = badge.text.startsWith(prefix)
        ? badge.text.slice(prefix.length)
        : badge.text === opt.text
          ? ""
          : badge.text;
      if (name) {
        const existing = typicalNamesMap[variant];
        typicalNamesMap[variant] = existing ? `${existing}, ${name}` : name;
      }
    }
  }

  const deadlineParts = order.date.split(".");
  const deadlineIso = deadlineParts.length === 3
    ? `${deadlineParts[2]}-${deadlineParts[1]}-${deadlineParts[0]}`
    : order.date;

  let responsesDeadlineLocal = "";
  if (order.responsesDeadline) {
    const d = new Date(order.responsesDeadline);
    if (!isNaN(d.getTime())) {
      const pad = (n: number) => String(n).padStart(2, "0");
      responsesDeadlineLocal = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }
  }

  return {
    id: order.id,
    title: order.title,
    company: order.company,
    deadline: deadlineIso,
    responsesDeadline: responsesDeadlineLocal,
    budget: String(Math.round(order.sumAmountRaw / 100)),
    selectedBadgeVariants: selectedVariants,
    typicalNamesMap,
    comment: order.comment,
    existingFiles: order.technicalFiles,
  };
}

const PAGE_LIMIT = 50;

export function useCustomerOrdersPage() {
  const { profile } = useUserProfile();
  const { showSuccess, showError: showErrorToast } = useNotifications();
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

  const [showCreateForm, setShowCreateFormRaw] = useState(getDraft().showCreateForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingOrder, setEditingOrder] = useState<OrderInitialData | null>(null);

  const setShowCreateForm = (value: boolean) => {
    setShowCreateFormRaw(value);
    saveDraft({ showCreateForm: value });
    if (!value) clearDraft();
  };
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
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
        showErrorToast("Укажите корректный бюджет");
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
        responses_deadline: toIsoWithTimezone(data.responsesDeadline) || undefined,
        badges: data.selectedBadges,
        files: data.files,
      });

      showSuccess("Заказ создан");
      setShowCreateForm(false);
      await fetchOrders();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Не удалось создать заказ";
      setError(message);
      showErrorToast(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditOrder = (order: CustomerOrderCardVM) => {
    setEditingOrder(buildInitialDataFromOrder(order));
  };

  const handleUpdateOrder = async (data: {
    title: string;
    company: string;
    deadline: string;
    responsesDeadline: string;
    budget: string;
    selectedBadges: { text: string; variant: string }[];
    typicalNames: string;
    comment: string;
    files: File[];
    keepFiles?: string[];
  }) => {
    if (!editingOrder) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const sumAmount = parseBudgetToKopecks(data.budget);
      if (sumAmount <= 0) {
        setError("Укажите корректный бюджет");
        showErrorToast("Укажите корректный бюджет");
        return;
      }

      await updateCustomerOrder(editingOrder.id, {
        title: data.title,
        company: data.company,
        typical_names: data.typicalNames,
        comment: data.comment,
        sum_amount: sumAmount,
        deadline: data.deadline,
        responses_deadline: toIsoWithTimezone(data.responsesDeadline) || undefined,
        badges: data.selectedBadges,
        files: data.files,
        keepFiles: data.keepFiles,
      });

      showSuccess("Заказ обновлён");
      setEditingOrder(null);
      await fetchOrders();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Не удалось обновить заказ";
      setError(message);
      showErrorToast(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    if (!confirm("Вы уверены, что хотите удалить этот заказ?")) return;
    setIsDeleting(orderId);
    try {
      await deleteCustomerOrder(orderId);
      showSuccess("Заказ удалён");
      await fetchOrders();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Не удалось удалить заказ";
      setError(message);
      showErrorToast(message);
    } finally {
      setIsDeleting(null);
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
    editingOrder,
    isDeleting,
    setShowCreateForm,
    setEditingOrder,
    handleCreateOrder,
    handleEditOrder,
    handleUpdateOrder,
    handleDeleteOrder,
    fetchOrders,
    ordersRef,
  };
}
