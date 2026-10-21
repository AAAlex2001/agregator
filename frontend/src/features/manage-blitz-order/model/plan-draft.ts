import type { BlitzAuditPlan, BlitzAuditPlanInput } from "@/entities/blitz-order";

/** Черновик Плана аудита: даты и время строками полей, пустая строка — не заполнено. */
export interface PlanDraft {
  documentsStart: string;
  documentsEnd: string;
  onsiteStart: string;
  onsiteEnd: string;
  meetings: boolean;
  openingAt: string;
  closingAt: string;
  meetingLink: string;
  workshops: string;
  interviewees: string;
}

/** Текстовое поле черновика Плана. */
export type PlanTextField = Exclude<keyof PlanDraft, "meetings">;

/** Черновик из прошлой версии Плана или пустой. */
export function planDraftOf(plan: BlitzAuditPlan | null): PlanDraft {
  return {
    documentsStart: plan?.documents_start ?? "",
    documentsEnd: plan?.documents_end ?? "",
    onsiteStart: plan?.onsite_start ?? "",
    onsiteEnd: plan?.onsite_end ?? "",
    meetings: plan?.meetings ?? true,
    openingAt: plan?.opening_at ?? "",
    closingAt: plan?.closing_at ?? "",
    meetingLink: plan?.meeting_link ?? "",
    workshops: plan?.workshops ?? "",
    interviewees: plan?.interviewees ?? "",
  };
}

/** Чего не хватает в Плане, или null. */
export function planProblem(draft: PlanDraft, withOnsite: boolean): string | null {
  if (!draft.documentsStart || !draft.documentsEnd) {
    return "Укажите даты документарного этапа";
  }

  if (withOnsite && (!draft.onsiteStart || !draft.onsiteEnd)) {
    return "Укажите даты выездного этапа";
  }

  if (draft.meetings && (!draft.openingAt || !draft.closingAt)) {
    return "Укажите время совещаний";
  }

  if (draft.interviewees.trim().length < 2) {
    return "Укажите, кого будут интервьюировать";
  }

  return null;
}

/** План для API. */
export function toPlanInput(draft: PlanDraft, withOnsite: boolean): BlitzAuditPlanInput {
  return {
    documents_start: draft.documentsStart,
    documents_end: draft.documentsEnd,
    onsite_start: withOnsite ? draft.onsiteStart : null,
    onsite_end: withOnsite ? draft.onsiteEnd : null,
    meetings: draft.meetings,
    opening_at: draft.meetings ? draft.openingAt : null,
    closing_at: draft.meetings ? draft.closingAt : null,
    meeting_link: draft.meetings ? draft.meetingLink.trim() || null : null,
    workshops: withOnsite ? draft.workshops.trim() || null : null,
    interviewees: draft.interviewees.trim(),
  };
}