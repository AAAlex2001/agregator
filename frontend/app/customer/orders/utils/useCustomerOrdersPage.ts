import { useEffect, useState } from "react";
import { createCustomerOrder } from "../store/api";
import { loadCustomerOrders } from "../store/actions";
import { useCustomerOrdersState } from "../store/state";

function parseBudgetToKopecks(value: string): number {
  const cleaned = value.replace(/[^\d.,]/g, "").replace(",", ".");
  const parsed = parseFloat(cleaned);
  if (isNaN(parsed) || parsed <= 0) return 0;
  return Math.round(parsed * 100);
}

function getCurrentUserId(): number {
  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem("user_id");
    if (stored) return Number(stored);
  }
  const fallback = process.env.NEXT_PUBLIC_EXPERT_ID;
  return fallback ? Number(fallback) : 0;
}

const PAGE_LIMIT = 50;

export function useCustomerOrdersPage() {
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
        customer_id: getCurrentUserId(),
        sum_amount: sumAmount,
        deadline: data.deadline,
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
  };
}
