"use client";

import { useReducer } from "react";
import type { FormEvent } from "react";
import { useBlitzCatalog } from "@/entities/blitz-order";
import { useNotifications } from "@/shared/ui/notifications";
import { submitCommissionApplication } from "../api/submit-commission-application";
import { commissionFormReducer, INITIAL_COMMISSION_FORM } from "./reducer";
import type { AttestationDraft, ContactField } from "./types";

/** Черновик заявки кандидата, справочник аттестаций и отправка. */
export function useCommissionForm() {
  const [state, dispatch] = useReducer(commissionFormReducer, INITIAL_COMMISSION_FORM);
  const { catalog, error: catalogError } = useBlitzCatalog();
  const { showError } = useNotifications();
  const { draft } = state;
  const isDraftReady = Boolean(draft.areaCode && draft.objectCode && draft.category);
  const canSubmit = state.fullName.trim().length >= 3
    && state.phone.trim().length >= 5
    && state.email.includes("@")
    && state.attestations.length > 0;

  /** Контактное поле или рассказ о себе. */
  function changeContact(field: ContactField, value: string) {
    dispatch({ type: "contact/change", field, value });
  }

  /** Выбранная аттестация до добавления. */
  function changeDraft(draft: AttestationDraft) {
    dispatch({ type: "draft/change", draft });
  }

  /** Добавляет выбранную аттестацию в список. */
  function addAttestation() {
    dispatch({ type: "attestation/add" });
  }

  /** Убирает аттестацию из списка. */
  function removeAttestation(index: number) {
    dispatch({ type: "attestation/remove", index });
  }

  /** Отправляет заявку и показывает благодарность. */
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit || state.isSubmitting) {
      return;
    }

    dispatch({ type: "submit/start" });

    try {
      await submitCommissionApplication({
        full_name: state.fullName.trim(),
        phone: state.phone.trim(),
        email: state.email.trim(),
        attestations: state.attestations,
        message: state.message.trim() || null,
      });
      dispatch({ type: "submit/success" });
    } catch (error) {
      dispatch({ type: "submit/error" });
      showError(error instanceof Error ? error.message : "Не удалось отправить заявку");
    }
  }

  return {
    state,
    catalog,
    catalogError,
    isDraftReady,
    canSubmit,
    changeContact,
    changeDraft,
    addAttestation,
    removeAttestation,
    submit,
  };
}
