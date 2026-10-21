"use client";

import { useRouter } from "next/navigation";
import { useEffect, useReducer } from "react";
import type { FormEvent } from "react";
import {
  BLITZ_AUDIT_FILE_MAX_SIZE,
  createBlitzAudit,
  getBlitzRequisites,
  useBlitzAuditCatalog,
  useBlitzFiles,
  useChecklistFiles,
} from "@/entities/blitz-order";
import type { BlitzAuditAttachments } from "@/entities/blitz-order";
import { toStepError, withStep } from "@/shared/lib/step-error";
import { useSteps } from "@/shared/lib/use-steps";
import { useNotifications } from "@/shared/ui/notifications";
import { AUDIT_FIELD_PLACES } from "../config/fields";
import { AUDIT_STEPS } from "../config/steps";
import type { AuditStep } from "../config/steps";
import { asksSto, toBlitzAuditPayload } from "./payload";
import { createBlitzAuditReducer, INITIAL_CREATE_BLITZ_AUDIT_STATE } from "./reducer";
import { auditStepProblem, firstAuditProblem } from "./steps";

/** Название шага по ключу. */
function titleOf(step: AuditStep): string {
  return AUDIT_STEPS.find((item) => item.key === step)?.title ?? "";
}

/** Черновик заявки на аудит по шагам, справочник, файлы и отправка. */
export function useCreateBlitzAudit() {
  const [state, dispatch] = useReducer(createBlitzAuditReducer, INITIAL_CREATE_BLITZ_AUDIT_STATE);
  const { catalog, error: catalogError } = useBlitzAuditCatalog();
  const checklist = useChecklistFiles();
  const companyCard = useBlitzFiles(1);
  const opoCertificate = useBlitzFiles(1, BLITZ_AUDIT_FILE_MAX_SIZE);
  const powerOfAttorney = useBlitzFiles(1, BLITZ_AUDIT_FILE_MAX_SIZE);
  const stoFile = useBlitzFiles(1, BLITZ_AUDIT_FILE_MAX_SIZE);
  const steps = useSteps(AUDIT_STEPS.length);
  const { showError, showSuccess } = useNotifications();
  const router = useRouter();

  useEffect(() => {
    let isActive = true;

    getBlitzRequisites()
      .then((requisites) => {
        if (isActive) {
          dispatch({ type: "requisites/fill", requisites });
        }
      })
      .catch(() => undefined);

    return () => {
      isActive = false;
    };
  }, []);

  /** Отдельные файлы, которые нужны этой заявке. */
  function attachments(): BlitzAuditAttachments {
    return {
      companyCard: companyCard.files[0] ?? null,
      opoCertificate: state.scope === "all" ? opoCertificate.files[0] ?? null : null,
      powerOfAttorney: state.applicant.by_proxy ? powerOfAttorney.files[0] ?? null : null,
      stoFile: state.useSto && asksSto(state.kind) ? stoFile.files[0] ?? null : null,
    };
  }

  const minPrice = catalog?.min_price ?? 0;

  /** Проверяет текущий шаг и открывает следующий. */
  function next() {
    const problem = auditStepProblem(AUDIT_STEPS[steps.step].key, state, attachments(), minPrice);

    if (problem) {
      showError(problem);
      return;
    }

    steps.forward();
  }

  /** На последнем шаге отправляет заявку, на остальных — переходит дальше. */
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!steps.isLast) {
      next();
      return;
    }

    const files = attachments();
    const failure = firstAuditProblem(state, files, minPrice);
    if (failure) {
      showError(withStep(AUDIT_STEPS[failure.step].title, failure.problem));
      steps.open(failure.step);
      return;
    }

    dispatch({ type: "submit/start" });

    try {
      const order = await createBlitzAudit(toBlitzAuditPayload(state), checklist.entries, files);

      showSuccess(
        state.kind === "consultation"
          ? "Заявка отправлена: менеджер свяжется с вами"
          : "Заявка отправлена аудиторам",
      );
      router.push(`/blitz-audit/orders/${order.id}`);
    } catch (error) {
      dispatch({ type: "submit/error" });
      const located = toStepError(
        error,
        AUDIT_FIELD_PLACES,
        titleOf,
        "Не удалось отправить заявку",
      );

      showError(located.message);

      if (located.step) {
        steps.open(AUDIT_STEPS.findIndex((item) => item.key === located.step));
      }
    }
  }

  return {
    state,
    dispatch,
    catalog,
    catalogError,
    checklist,
    companyCard,
    opoCertificate,
    powerOfAttorney,
    stoFile,
    steps,
    submit,
  };
}
