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
import { useNotifications } from "@/shared/ui/notifications";
import { asksSto, blitzAuditProblem, toBlitzAuditPayload } from "./payload";
import { createBlitzAuditReducer, INITIAL_CREATE_BLITZ_AUDIT_STATE } from "./reducer";

/** Черновик заявки на аудит, справочник, файлы и отправка. */
export function useCreateBlitzAudit() {
  const [state, dispatch] = useReducer(createBlitzAuditReducer, INITIAL_CREATE_BLITZ_AUDIT_STATE);
  const { catalog, error: catalogError } = useBlitzAuditCatalog();
  const checklist = useChecklistFiles();
  const companyCard = useBlitzFiles(1);
  const opoCertificate = useBlitzFiles(1, BLITZ_AUDIT_FILE_MAX_SIZE);
  const powerOfAttorney = useBlitzFiles(1, BLITZ_AUDIT_FILE_MAX_SIZE);
  const stoFile = useBlitzFiles(1, BLITZ_AUDIT_FILE_MAX_SIZE);
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

  /** Отправляет заявку и открывает её. */
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const files = attachments();
    const problem = blitzAuditProblem(state, files, catalog?.min_price ?? 0);
    if (problem) {
      showError(problem);
      return;
    }

    dispatch({ type: "submit/start" });

    try {
      const order = await createBlitzAudit(toBlitzAuditPayload(state), checklist.entries, files);

      showSuccess(
        state.kind === "consultation"
          ? "Заявка отправлена: менеджер свяжется с вами"
          : "Заявка отправлена руководителям аудиторских групп",
      );
      router.push(`/blitz-audit/orders/${order.id}`);
    } catch (error) {
      dispatch({ type: "submit/error" });
      showError(error instanceof Error ? error.message : "Не удалось отправить заявку");
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
    submit,
  };
}
