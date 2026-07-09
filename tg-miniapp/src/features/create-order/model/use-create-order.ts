import { useEffect, useReducer } from "react";
import { useSession } from "@/features/session";
import { emitError } from "@/shared/services/error-bus";
import { notifyHaptic } from "@/shared/services/telegram";
import { computeBadgeCodes, parseBadgeCodes } from "@/entites/expertise";
import { createOrder, type Order } from "@/entites/order";
import { initialState, reducer } from "./reducer";
import type { FileKey } from "./types";

const MAX_FILES = 6;
const MAX_FILES_TOTAL_BYTES = 100 * 1024 * 1024;

export type StepKey = "details" | "requirements" | "docs" | "confirm";

const FLOW: StepKey[] = ["details", "requirements", "docs", "confirm"];

export function useCreateOrder(open: boolean, onCreated: () => void, template: Order | null = null) {
  const { profile } = useSession();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!open) return;
    if (!template) {
      dispatch({ type: "reset" });
      return;
    }
    const selection = parseBadgeCodes(template.badges.map((badge) => badge.text));
    dispatch({
      type: "copy",
      sourceOrderId: template.id,
      documents: template.documents,
      title: template.title,
      sum: template.sum_amount_raw ? String(Math.round(template.sum_amount_raw / 100)) : "",
      startDate: template.start_date ? template.start_date.split(".").reverse().join("-") : "",
      deadline: template.deadline_at,
      responsesDeadline: template.responses_deadline ?? "",
      requiresExpert: template.requires_expert,
      requiresLicense: template.requires_license,
      types: selection.types,
      opos: selection.opos,
      comment: template.comment,
    });
  }, [open, template]);

  const stepKey: StepKey = FLOW[state.step - 1] ?? "details";
  const total = FLOW.length;
  const badgeCodes = computeBadgeCodes(state.types, state.opos);
  const company = profile?.company_data?.value ?? "";

  const allFiles = [
    state.files.technical,
    state.files.contract,
    state.files.company,
    ...state.otherFiles,
  ].filter((f): f is File => f !== null);
  const copiedCount = Object.values(state.copiedDocuments).reduce((sum, paths) => sum + paths.length, 0);

  const acceptFiles = (incoming: File[], replacingCopied = 0): boolean => {
    if (copiedCount - replacingCopied + allFiles.length + incoming.length > MAX_FILES) {
      emitError(`Можно прикрепить не более ${MAX_FILES} файлов`);
      return false;
    }
    const totalSize = [...allFiles, ...incoming].reduce((sum, f) => sum + f.size, 0);
    if (totalSize > MAX_FILES_TOTAL_BYTES) {
      emitError("Суммарный размер файлов не должен превышать 100 МБ");
      return false;
    }
    return true;
  };

  const setFile = (key: FileKey, list: FileList | null) => {
    const file = list?.[0];
    if (!file) return;
    if (!acceptFiles([file], state.copiedDocuments[key].length)) return;
    state.copiedDocuments[key].forEach((url) => dispatch({ type: "removeCopied", url }));
    dispatch({ type: "file", key, file });
  };

  const addOther = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    const files = Array.from(list);
    if (!acceptFiles(files)) return;
    dispatch({ type: "addOther", files });
  };

  const stepReady: Record<StepKey, boolean> = {
    details: state.title.trim() !== "" && state.startDate !== "" && state.deadline !== "",
    requirements: state.requiresExpert || state.requiresLicense,
    docs: true,
    confirm: true,
  };

  const submit = async () => {
    if (state.busy) return;
    dispatch({ type: "busy", value: true });
    try {
      await createOrder(
        {
          title: state.title,
          company,
          comment: state.comment,
          sumRubles: state.sum,
          startDate: state.startDate,
          deadline: state.deadline,
          responsesDeadline: state.responsesDeadline,
          requiresExpert: state.requiresExpert,
          requiresLicense: state.requiresLicense,
          badgeCodes,
          copySourceOrderId: state.copySourceOrderId,
          copyDocuments: state.copiedDocuments,
        },
        { ...state.files, other: state.otherFiles },
      );
      notifyHaptic("success");
      dispatch({ type: "done" });
      onCreated();
    } catch (e) {
      emitError(e instanceof Error ? e.message : "Не удалось создать заказ");
    } finally {
      dispatch({ type: "busy", value: false });
    }
  };

  const next = () => {
    if (stepKey === "confirm") {
      void submit();
      return;
    }
    dispatch({ type: "step", value: state.step + 1 });
  };

  const back = () => dispatch({ type: "step", value: state.step - 1 });

  return { state, dispatch, stepKey, total, stepReady, badgeCodes, company, next, back, setFile, addOther };
}
