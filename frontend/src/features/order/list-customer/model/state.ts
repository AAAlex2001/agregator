import { useEffect, useReducer, useState } from "react";
import { useUserProfile } from "@/shared/lib/hooks/useUserProfile";
import { useNotifications } from "@/shared/ui/Notifications";
import {
  loadCustomerOrders,
  buildInitialDataFromOrder,
  handleCreateOrder,
  handleUpdateOrder,
  handleDeleteOrder,
} from "./actions";
import { getDraft, saveDraft, clearDraft } from "./draft";
import type { CustomerOrderCardVM, CustomerOrdersState } from "./types";
import type { OrderInitialData } from "@/features/order/create/ui/CreateOrderForm/CreateOrderForm";

const PAGE_LIMIT = 50;

type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_ORDERS"; payload: CustomerOrderCardVM[] }
  | { type: "SET_TOTAL"; payload: number }
  | { type: "PREPEND_ORDER"; payload: CustomerOrderCardVM }
  | { type: "RESET" };

const initialState: CustomerOrdersState = { items: [], total: 0, isLoading: false, error: null };

function reducer(state: CustomerOrdersState, action: Action): CustomerOrdersState {
  switch (action.type) {
    case "SET_LOADING": return { ...state, isLoading: action.payload };
    case "SET_ERROR": return { ...state, error: action.payload };
    case "SET_ORDERS": return { ...state, items: action.payload };
    case "SET_TOTAL": return { ...state, total: action.payload };
    case "PREPEND_ORDER": return { ...state, items: [action.payload, ...state.items], total: state.total + 1 };
    case "RESET": return initialState;
    default: return state;
  }
}

export function useCustomerOrdersState() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { profile } = useUserProfile();
  const { showSuccess, showError: showErrorToast } = useNotifications();

  const [showCreateForm, setShowCreateFormRaw] = useState(getDraft().showCreateForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingOrder, setEditingOrder] = useState<OrderInitialData | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const setError = (e: string | null) => dispatch({ type: "SET_ERROR", payload: e });

  const setShowCreateForm = (value: boolean) => {
    setShowCreateFormRaw(value);
    saveDraft({ showCreateForm: value });
    if (!value) clearDraft();
  };

  const fetchOrders = () =>
    loadCustomerOrders({
      pageLimit: PAGE_LIMIT,
      setLoading: (v) => dispatch({ type: "SET_LOADING", payload: v }),
      setError,
      setOrders: (items) => dispatch({ type: "SET_ORDERS", payload: items }),
      setTotal: (t) => dispatch({ type: "SET_TOTAL", payload: t }),
    });

  useEffect(() => { void fetchOrders(); }, []);

  return {
    ...state,
    showCreateForm, setShowCreateForm,
    isSubmitting, editingOrder, setEditingOrder,
    isDeleting, fetchOrders,

    onEdit: (order: CustomerOrderCardVM) => setEditingOrder(buildInitialDataFromOrder(order)),

    onCreate: async (data: Parameters<typeof handleCreateOrder>[0]) => {
      setIsSubmitting(true);
      setError(null);
      await handleCreateOrder(data, profile?.id ?? 0,
        async () => { showSuccess("Заказ создан"); setShowCreateForm(false); await fetchOrders(); },
        (msg) => { setError(msg); showErrorToast(msg); },
      );
      setIsSubmitting(false);
    },

    onUpdate: async (data: Parameters<typeof handleUpdateOrder>[1]) => {
      if (!editingOrder) return;
      setIsSubmitting(true);
      setError(null);
      await handleUpdateOrder(editingOrder.id, data,
        async () => { showSuccess("Заказ обновлён"); setEditingOrder(null); await fetchOrders(); },
        (msg) => { setError(msg); showErrorToast(msg); },
      );
      setIsSubmitting(false);
    },

    onDelete: async (orderId: number) => {
      if (!confirm("Вы уверены, что хотите удалить этот заказ?")) return;
      setIsDeleting(orderId);
      await handleDeleteOrder(orderId,
        async () => { showSuccess("Заказ удалён"); await fetchOrders(); },
        (msg) => { setError(msg); showErrorToast(msg); },
      );
      setIsDeleting(null);
    },
  };
}
