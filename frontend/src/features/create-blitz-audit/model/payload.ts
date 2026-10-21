import { parseBlitzPrice } from "@/entities/blitz-order";
import type {
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
