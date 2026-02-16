import type { CreateResponsePayload } from "@/app/responses/store/types";
import { loadOrders } from "../store/actions";
import type { OrderCardViewModel } from "../store/types";

interface FetchInitialOrdersParams {
  pageLimit: number;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setOrders: (orders: OrderCardViewModel[]) => void;
  setTotal: (total: number) => void;
}

interface FetchMoreOrdersParams {
  skip: number;
  pageLimit: number;
  appendOrders: (orders: OrderCardViewModel[]) => void;
  setTotal: (total: number) => void;
  setError: (error: string | null) => void;
}

interface WheelDeltaParams {
  deltaX: number;
  deltaY: number;
  deltaMode: number;
  containerWidth: number;
}

export function parseOrderSumAmount(sum: string): number {
  const normalized = sum.replace("₽", "").replace(/\s+/g, "").replace(",", ".").trim();
  const amount = Number(normalized);

  if (!Number.isFinite(amount) || amount <= 0) {
    return 100;
  }

  return Math.round(amount * 100);
}

export function parseOrderDateToIso(date: string): string {
  const [day, month, year] = date.split(".");

  if (!day || !month || !year) {
    return new Date().toISOString().slice(0, 10);
  }

  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

export function buildCreateResponsePayload(order: Pick<OrderCardViewModel, "comment" | "sum" | "date">): CreateResponsePayload {
  return {
    comment: order.comment,
    proposed_sum_amount: parseOrderSumAmount(order.sum),
    proposed_deadline: parseOrderDateToIso(order.date),
  };
}

export async function fetchInitialOrdersData({
  pageLimit,
  setLoading,
  setError,
  setOrders,
  setTotal,
}: FetchInitialOrdersParams): Promise<void> {
  setLoading(true);
  setError(null);

  try {
    await loadOrders(
      0,
      pageLimit,
      ({ items, total }) => {
        setOrders(items);
        setTotal(total);
      },
      (error) => {
        setError(error);
      }
    );
  } finally {
    setLoading(false);
  }
}

export async function fetchMoreOrdersData({
  skip,
  pageLimit,
  appendOrders,
  setTotal,
  setError,
}: FetchMoreOrdersParams): Promise<void> {
  await loadOrders(
    skip,
    pageLimit,
    ({ items, total }) => {
      appendOrders(items);
      setTotal(total);
    },
    (loadError) => {
      setError(loadError);
    }
  );
}

export function hasReachedHorizontalEnd(
  scrollLeft: number,
  clientWidth: number,
  scrollWidth: number,
  threshold = 120
): boolean {
  return scrollLeft + clientWidth >= scrollWidth - threshold;
}

export function getNormalizedWheelDelta({
  deltaX,
  deltaY,
  deltaMode,
  containerWidth,
}: WheelDeltaParams): number {
  const PIXEL_MULTIPLIER = 2;
  const LINE_HEIGHT = 40;

  let delta = Math.abs(deltaY) >= Math.abs(deltaX) ? deltaY : deltaX;

  if (deltaMode === 1) {
    delta *= LINE_HEIGHT;
  } else if (deltaMode === 2) {
    delta *= containerWidth;
  }

  return delta * PIXEL_MULTIPLIER;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}
