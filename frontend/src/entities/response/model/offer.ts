import type { VatKind } from "./types";

/** Предложение исполнителя: сроки, стоимость в рублях, НДС и комментарий. */
export interface ResponseOffer {
  startDate: string;
  deadline: string;
  cost: string;
  vatKind: VatKind;
  comment: string;
}

/** Поля предложения, которые сохраняются без преобразования. */
export type ResponseOfferTextField = "startDate" | "deadline" | "comment";

/** Изменения сроков, стоимости, налога и комментария. */
export type ResponseOfferAction =
  | { type: "field/changed"; field: ResponseOfferTextField; value: string }
  | { type: "cost/changed"; value: string }
  | { type: "vat/changed"; value: VatKind };

/** Рамки заказчика: сроки в формате ДД.ММ.ГГГГ и бюджет в копейках, 0 — без ограничения. */
export interface ResponseOfferBounds {
  startDate: string;
  deadline: string;
  budget: number;
}

/** Пустое предложение. */
export const EMPTY_RESPONSE_OFFER: ResponseOffer = {
  startDate: "",
  deadline: "",
  cost: "",
  vatKind: "NONE",
  comment: "",
};

/** Меняет поля предложения и оставляет в стоимости только цифры. */
export function responseOfferReducer(
  state: ResponseOffer,
  action: ResponseOfferAction,
): ResponseOffer {
  switch (action.type) {
    case "field/changed":
      return { ...state, [action.field]: action.value };
    case "cost/changed":
      return { ...state, cost: action.value.replace(/\D/g, "") };
    case "vat/changed":
      return { ...state, vatKind: action.value };
  }
}

/** Начало дня даты календаря ГГГГ-ММ-ДД, 0 — даты нет. */
function dayTimestamp(value: string): number {
  return value ? new Date(`${value}T00:00:00`).getTime() : 0;
}

/** Начало дня срока заказчика: API отдаёт ДД.ММ.ГГГГ, иногда уже ГГГГ-ММ-ДД. */
function boundTimestamp(value: string): number {
  const [day, month, year] = value.split(".");

  return dayTimestamp(year ? `${year}-${month}-${day}` : value);
}

/** Первая ошибка сроков и стоимости, или пустая строка. Сроки сверяются с рамками заказчика. */
export function getResponseTermsError(offer: ResponseOffer, bounds: ResponseOfferBounds): string {
  if (!offer.startDate) {
    return "Укажите срок начала выполнения работ";
  }

  if (!offer.deadline) {
    return "Укажите срок окончания выполнения работ";
  }

  if (!offer.cost || Number(offer.cost) <= 0) {
    return "Укажите стоимость работ";
  }

  if (bounds.budget > 0 && Number(offer.cost) * 100 > bounds.budget) {
    return "Стоимость не может превышать бюджет заказчика";
  }

  const boundStart = boundTimestamp(bounds.startDate);
  const boundDeadline = boundTimestamp(bounds.deadline);
  const start = dayTimestamp(offer.startDate);
  const deadline = dayTimestamp(offer.deadline);

  if (boundStart && start < boundStart) {
    return "Срок начала выполнения работ не может быть раньше срока заказчика";
  }

  if (boundDeadline && deadline > boundDeadline) {
    return "Срок окончания выполнения работ не может быть позже срока заказчика";
  }

  return start > deadline ? "Срок начала выполнения работ не может быть позже срока окончания" : "";
}

/** Поля предложения для API: стоимость в копейках. */
export function toResponseOfferRequest(offer: ResponseOffer) {
  return {
    comment: offer.comment,
    proposed_sum_amount: Math.round(Number(offer.cost) * 100),
    proposed_start_date: offer.startDate,
    proposed_deadline: offer.deadline,
    vat_kind: offer.vatKind,
  };
}