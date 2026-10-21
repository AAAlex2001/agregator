import { parseBlitzPrice } from "@/entities/blitz-order";
import type {
  BlitzAuditAttachments,
  BlitzAuditDetails,
  BlitzAuditKind,
  BlitzAuditPayload,
} from "@/entities/blitz-order";
import type { CreateBlitzAuditState } from "./types";

/** Типы аудита, для которых спрашиваем про СТО организации. */
const STO_KINDS: BlitzAuditKind[] = ["basic", "interim"];

/** Нужно ли спросить про СТО. */
export function asksSto(kind: BlitzAuditKind | ""): boolean {
  return STO_KINDS.some((item) => item === kind);
}

/** Что не так с представителем и объектами, или null. */
function subjectProblem(state: CreateBlitzAuditState): string | null {
  const { applicant } = state;

  if (!applicant.full_name.trim() || !applicant.position.trim() || !applicant.organization.trim()) {
    return "Заполните сведения о представителе заказчика";
  }

  if (!/^\d{10}(\d{2})?$/.test(applicant.inn.trim())) {
    return "ИНН организации — 10 или 12 цифр";
  }

  if (!applicant.phone.trim() || !applicant.email.trim()) {
    return "Укажите телефон и почту представителя";
  }

  if (state.scope === "all") {
    const count = Number(state.fleet.count);

    if (!(count >= 1) || !state.fleet.profile.trim() || state.fleet.multi_region === null) {
      return "Заполните сведения об ОПО организации";
    }

    return null;
  }

  const incomplete = state.objects.some((item) => (
    !item.reg_number.trim()
      || !item.name.trim()
      || !item.hazard_class
      || !item.address.trim()
      || !item.industry.trim()
      || item.hazard_signs.length === 0
  ));

  return incomplete ? "Заполните сведения обо всех ОПО" : null;
}

/** Что не так с параметрами, сроками и ценой, или null. */
function termsProblem(state: CreateBlitzAuditState, minPrice: number): string | null {
  if (state.stages.length === 0) {
    return "Выберите этапы аудита";
  }

  if (!state.kind) {
    return "Выберите тип аудита";
  }

  if (asksSto(state.kind) && state.useSto === null) {
    return "Укажите, учитывать ли СТО организации";
  }

  if (state.useSto && asksSto(state.kind) && !state.stoName.trim()) {
    return "Укажите наименование и реквизиты СТО";
  }

  if (state.kind === "selective" && state.elements.length === 0) {
    return "Выберите направления выборочного аудита";
  }

  if (state.timing === "custom" && (!state.timingStart || !state.timingEnd)) {
    return "Укажите период проведения аудита";
  }

  if (state.budget === "custom" && !(parseBlitzPrice(state.price) >= minPrice)) {
    return `Стоимость аудита — не менее ${minPrice.toLocaleString("ru-RU")} ₽`;
  }

  return null;
}

/** Каких файлов не хватает, или null. */
function filesProblem(
  state: CreateBlitzAuditState,
  attachments: BlitzAuditAttachments,
): string | null {
  if (state.applicant.by_proxy && !attachments.powerOfAttorney) {
    return "Приложите доверенность";
  }

  if (state.useSto && asksSto(state.kind) && !attachments.stoFile) {
    return "Приложите файл СТО";
  }

  return null;
}

/** Что ещё не заполнено, или null, если заявку можно отправить. */
export function blitzAuditProblem(
  state: CreateBlitzAuditState,
  attachments: BlitzAuditAttachments,
  minPrice: number,
): string | null {
  return subjectProblem(state) ?? termsProblem(state, minPrice) ?? filesProblem(state, attachments);
}

/** Анкета аудита для API. */
function toDetails(state: CreateBlitzAuditState): BlitzAuditDetails {
  const isAll = state.scope === "all";
  const kind = state.kind || "basic";
  const withSto = asksSto(kind);

  return {
    applicant: state.applicant,
    scope: state.scope,
    objects: isAll ? [] : state.objects,
    fleet: isAll
      ? {
          count: Number(state.fleet.count),
          profile: state.fleet.profile.trim(),
          multi_region: state.fleet.multi_region ?? false,
        }
      : null,
    stages: state.stages,
    params: {
      kind,
      use_sto: withSto ? state.useSto : null,
      sto_name: withSto && state.useSto ? state.stoName.trim() : null,
      elements: kind === "selective" ? state.elements : [],
    },
    timing: {
      kind: state.timing,
      start: state.timing === "custom" ? state.timingStart : null,
      end: state.timing === "custom" ? state.timingEnd : null,
    },
    budget: {
      mode: state.budget,
      negotiation: state.negotiation,
    },
  };
}

/** Данные заявки на аудит для API. */
export function toBlitzAuditPayload(state: CreateBlitzAuditState): BlitzAuditPayload {
  return {
    details: toDetails(state),
    price: state.budget === "custom" ? parseBlitzPrice(state.price) : null,
    customer_type: state.customerType,
    company: { ...state.company, kpp: state.company.kpp || null },
    comment: state.comment.trim() || null,
  };
}
