import { useEffect, useReducer, useRef, useState } from "react";
import { useUserProfile } from "@/shared/lib/hooks/useUserProfile";
import { copyOrderLink } from "@/shared/lib/copyOrderLink";
import { useOrdersWebSocket } from "../lib/useOrdersWebSocket";
import { loadOrders, handleRespondToOrder, handleTopUp } from "./actions";
import { mapOrderToCardViewModel } from "./mappers";
import type { OrderCardViewModel, OrdersState } from "./types";
import type { Step2FormData } from "@/features/order/details/ui/OrderDetailsModal/types";

const PAGE_LIMIT = 50;

type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_ORDERS"; payload: OrderCardViewModel[] }
  | { type: "APPEND_ORDERS"; payload: OrderCardViewModel[] }
  | { type: "SET_TOTAL"; payload: number }
  | { type: "PREPEND_ORDER"; payload: OrderCardViewModel }
  | { type: "UPDATE_ORDER"; payload: OrderCardViewModel }
  | { type: "REMOVE_ORDER"; payload: number }
  | { type: "RESET" };

const initialState: OrdersState = { items: [], total: 0, isLoading: false, error: null };

function uniqueById(items: OrderCardViewModel[]): OrderCardViewModel[] {
  const seen = new Set<number>();
  return items.filter((i) => { if (seen.has(i.id)) return false; seen.add(i.id); return true; });
}

function reducer(state: OrdersState, action: Action): OrdersState {
  switch (action.type) {
    case "SET_LOADING": return { ...state, isLoading: action.payload };
    case "SET_ERROR": return { ...state, error: action.payload };
    case "SET_ORDERS": return { ...state, items: uniqueById(action.payload) };
    case "APPEND_ORDERS": return { ...state, items: uniqueById([...state.items, ...action.payload]) };
    case "SET_TOTAL": return { ...state, total: action.payload };
    case "PREPEND_ORDER": return { ...state, items: uniqueById([action.payload, ...state.items]), total: state.total + 1 };
    case "UPDATE_ORDER": return { ...state, items: state.items.map((i) => i.id === action.payload.id ? action.payload : i) };
    case "REMOVE_ORDER": return { ...state, items: state.items.filter((i) => i.id !== action.payload), total: Math.max(0, state.total - 1) };
    case "RESET": return initialState;
    default: return state;
  }
}

export function useExpertOrdersState() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { balance } = useUserProfile();

  const [returnOrderId] = useState(() => {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search).get("orderId");
  });

  const [selectedOrder, setSelectedOrder] = useState<OrderCardViewModel | null>(null);
  const [isResponding, setIsResponding] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const isLoadingMoreRef = useRef(false);

  const setError = (e: string | null) => dispatch({ type: "SET_ERROR", payload: e });
  const removeOrder = (id: number) => dispatch({ type: "REMOVE_ORDER", payload: id });

  const hasMoreOrders = state.items.length < state.total;

  // WebSocket
  useOrdersWebSocket({
    onCreated: (order) => dispatch({ type: "PREPEND_ORDER", payload: mapOrderToCardViewModel(order) }),
    onUpdated: (order) => dispatch({ type: "UPDATE_ORDER", payload: mapOrderToCardViewModel(order) }),
    onRemoved: (id) => removeOrder(id),
  });

  // Initial fetch
  const reload = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });
    try {
      await loadOrders(0, PAGE_LIMIT,
        ({ items, total }) => { dispatch({ type: "SET_ORDERS", payload: items }); dispatch({ type: "SET_TOTAL", payload: total }); },
        (msg) => setError(msg),
      );
    } finally { dispatch({ type: "SET_LOADING", payload: false }); }
  };

  const loadMore = async () => {
    if (state.isLoading || isLoadingMore || isLoadingMoreRef.current || !hasMoreOrders) return;
    isLoadingMoreRef.current = true;
    setIsLoadingMore(true);
    try {
      await loadOrders(state.items.length, PAGE_LIMIT,
        ({ items, total }) => { dispatch({ type: "APPEND_ORDERS", payload: items }); dispatch({ type: "SET_TOTAL", payload: total }); },
        (msg) => setError(msg),
      );
    } finally { isLoadingMoreRef.current = false; setIsLoadingMore(false); }
  };

  useEffect(() => { void reload(); }, []);

  // Return order deep-link
  useEffect(() => {
    if (!returnOrderId || state.items.length === 0) return;
    const order = state.items.find((i) => String(i.id) === returnOrderId);
    if (order) setSelectedOrder(order);
  }, [returnOrderId, state.items]);

  return {
    ...state, balance, returnOrderId,
    selectedOrder, setSelectedOrder,
    isLoadingMore, hasMoreOrders,
    isResponding,
    reload, loadMore,

    onShare: (publicId: string, onCopied: () => void) => copyOrderLink(publicId, onCopied),

    onRespond: async (order: { id: number }, formData: Step2FormData) => {
      setIsResponding(true);
      await handleRespondToOrder(order.id, formData,
        () => { removeOrder(order.id); setSelectedOrder(null); },
        (msg) => setError(msg),
      );
      setIsResponding(false);
    },

    onTopUp: (amount: number) => {
      if (!selectedOrder) return;
      void handleTopUp(selectedOrder.id, amount, (msg) => setError(msg));
    },
  };
}
