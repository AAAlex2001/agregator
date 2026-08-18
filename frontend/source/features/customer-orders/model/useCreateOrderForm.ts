"use client";

import { useEffect, useReducer, type FormEvent } from "react";
import {
  freeSlots,
  singleSlotIsFilled,
  totalDocumentsCount,
  totalNewFilesBytes,
  MAX_ORDER_DOCUMENTS,
  MAX_ORDER_FILES_TOTAL_BYTES,
  ORDER_WORK_OPTIONS,
  type DocumentsFormState,
  type OrderCardData,
} from "@/source/entities/order";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { useSession } from "@/source/features/session";
import { clearDraft, saveDraft } from "./orderDraft";
import { initOrderForm, orderFormValues, reducer, type OrderFormValues, type SingleCategory } from "./orderForm";

const MAX_TOTAL_MB = Math.round(MAX_ORDER_FILES_TOTAL_BYTES / 1024 / 1024);
const FILE_COUNT_ERROR = `Можно прикрепить не более ${MAX_ORDER_DOCUMENTS} файлов`;
const FILE_SIZE_ERROR = `Суммарный размер новых файлов не должен превышать ${MAX_TOTAL_MB} МБ`;

interface Props {
  editTarget?: OrderCardData;
  copyTemplate?: OrderCardData;
  onSubmit: (values: OrderFormValues, documents: DocumentsFormState, options: { notifyResponders: boolean }) => void;
}

export function useCreateOrderForm({ editTarget, copyTemplate, onSubmit }: Props) {
  const isEdit = Boolean(editTarget);
  const { showError } = useNotifications();
  const { user } = useSession();
  const [state, dispatch] = useReducer(reducer, { editTarget, copyTemplate }, initOrderForm);

  const company = user?.company_data?.value ?? "";
  useEffect(() => {
    if (company) dispatch({ type: "set", key: "company", value: company });
  }, [company]);

  useEffect(() => {
    if (isEdit || !user) return;
    dispatch({
      type: "applicantDefaults",
      value: {
        applicant_full_name: [user.last_name, user.first_name].filter(Boolean).join(" "),
        applicant_position: "",
        applicant_organization: user.company_data?.value ?? "",
        applicant_inn: user.inn ?? "",
        applicant_phone: user.phone ?? "",
        applicant_email: user.email ?? "",
      },
    });
  }, [isEdit, user]);

  useEffect(() => {
    if (isEdit) return;
    const available = user?.directions ?? [];
    if (available.length === 0 || available.includes(state.workType)) return;
    const first = ORDER_WORK_OPTIONS.find((option) => available.includes(option.value));
    if (first) dispatch({ type: "workType", value: first.value });
  }, [isEdit, user, state.workType]);

  useEffect(() => {
    if (isEdit) return;
    saveDraft(orderFormValues(state));
  }, [state, isEdit]);

  const setSingle = (category: SingleCategory, file: File | null) => {
    if (file !== null) {
      const needsFreeSlot = !singleSlotIsFilled(state.documents[category]);
      if (needsFreeSlot && freeSlots(state.documents) <= 0) {
        showError(FILE_COUNT_ERROR);
        return;
      }
      if (totalNewFilesBytes(state.documents) + file.size > MAX_ORDER_FILES_TOTAL_BYTES) {
        showError(FILE_SIZE_ERROR);
        return;
      }
    }
    dispatch({ type: "docSingle", category, file });
  };

  const addOther = (incoming: File[]) => {
    const free = freeSlots(state.documents);
    if (incoming.length > free) {
      showError(FILE_COUNT_ERROR);
    }
    const accepted: File[] = [];
    let bytes = totalNewFilesBytes(state.documents);
    for (const file of incoming.slice(0, free)) {
      if (bytes + file.size > MAX_ORDER_FILES_TOTAL_BYTES) {
        showError(FILE_SIZE_ERROR);
        break;
      }
      bytes += file.size;
      accepted.push(file);
    }
    if (accepted.length > 0) {
      dispatch({ type: "docAddOther", files: accepted });
    }
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!state.startDate) {
      showError("Укажите срок начала выполнения работ");
      return;
    }
    if (!state.deadline) {
      showError("Укажите срок окончания выполнения работ");
      return;
    }
    if (!state.requiresExpert && !state.requiresLicense) {
      showError("Выберите, что требуется: исполнитель и/или лицензия");
      return;
    }
    if (state.workType === "DESIGN" && totalDocumentsCount(state.documents) === 0) {
      showError("Приложите задание на проектирование");
      return;
    }
    onSubmit(orderFormValues(state), state.documents, { notifyResponders: state.notifyResponders });
    if (!isEdit) clearDraft();
  };

  return { isEdit, state, dispatch, submit, setSingle, addOther };
}
