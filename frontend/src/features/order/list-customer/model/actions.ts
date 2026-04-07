import { fetchCustomerOrders, createCustomerOrder, updateCustomerOrder, deleteCustomerOrder } from "./api";
import { mapOrderToCustomerCard } from "./mappers";
import type { CustomerOrderCardVM, CustomerOrdersState } from "./types";
import type { OrderInitialData } from "@/features/order/create/ui/CreateOrderForm/CreateOrderForm";
import { BADGE_OPTIONS } from "@/features/order/create/ui/CreateOrderForm/sections";

interface LoadOrdersParams {
  pageLimit: number;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setOrders: (orders: CustomerOrderCardVM[]) => void;
  setTotal: (total: number) => void;
}

export async function loadCustomerOrders({
  pageLimit,
  setLoading,
  setError,
  setOrders,
  setTotal,
}: LoadOrdersParams): Promise<void> {
  setLoading(true);
  setError(null);

  try {
    const data = await fetchCustomerOrders(0, pageLimit);
    setOrders(data.items.map(mapOrderToCustomerCard));
    setTotal(data.total);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Не удалось загрузить заказы";
    setError(message);
  } finally {
    setLoading(false);
  }
}

function parseBudgetToKopecks(value: string): number {
  if (!value.trim()) return 0;
  const cleaned = value.replace(/[^\d.,]/g, "").replace(",", ".");
  const parsed = parseFloat(cleaned);
  if (isNaN(parsed) || parsed < 0) return -1;
  return Math.round(parsed * 100);
}

function toIsoWithTimezone(localDatetime: string): string {
  if (!localDatetime) return "";
  const d = new Date(localDatetime);
  if (isNaN(d.getTime())) return localDatetime;
  return d.toISOString();
}

export function buildInitialDataFromOrder(order: CustomerOrderCardVM): OrderInitialData {
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

export async function handleCreateOrder(
  data: {
    title: string;
    company: string;
    deadline: string;
    responsesDeadline: string;
    budget: string;
    selectedBadges: { text: string; variant: string }[];
    typicalNames: string;
    comment: string;
    files: File[];
  },
  customerId: number,
  onSuccess: () => void,
  onError: (message: string) => void,
): Promise<void> {
  const sumAmount = parseBudgetToKopecks(data.budget);
  if (sumAmount < 0) {
    onError("Укажите корректный бюджет");
    return;
  }

  try {
    await createCustomerOrder({
      title: data.title,
      company: data.company,
      typical_names: data.typicalNames,
      comment: data.comment,
      customer_id: customerId,
      sum_amount: sumAmount,
      deadline: data.deadline,
      responses_deadline: toIsoWithTimezone(data.responsesDeadline) || undefined,
      badges: data.selectedBadges,
      files: data.files,
    });
    onSuccess();
  } catch (err) {
    onError(err instanceof Error ? err.message : "Не удалось создать заказ");
  }
}

export async function handleUpdateOrder(
  orderId: number,
  data: {
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
  },
  onSuccess: () => void,
  onError: (message: string) => void,
): Promise<void> {
  const sumAmount = parseBudgetToKopecks(data.budget);
  if (sumAmount < 0) {
    onError("Укажите корректный бюджет");
    return;
  }

  try {
    await updateCustomerOrder(orderId, {
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
    onSuccess();
  } catch (err) {
    onError(err instanceof Error ? err.message : "Не удалось обновить заказ");
  }
}

export async function handleDeleteOrder(
  orderId: number,
  onSuccess: () => void,
  onError: (message: string) => void,
): Promise<void> {
  try {
    await deleteCustomerOrder(orderId);
    onSuccess();
  } catch (err) {
    onError(err instanceof Error ? err.message : "Не удалось удалить заказ");
  }
}
