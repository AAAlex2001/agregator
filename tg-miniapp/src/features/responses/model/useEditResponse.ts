import { useEffect, useState } from "react";
import { emitError } from "@/shared/services/error-bus";
import { notifyHaptic } from "@/shared/services/telegram";
import { editResponse, type ExpertResponse, type VatKind } from "@/entites/response";
import { toKopecks } from "@/shared/lib/format";

export function useEditResponse(response: ExpertResponse | null, onSaved: () => void) {
  const [startDate, setStartDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [sum, setSum] = useState("");
  const [vat, setVat] = useState<VatKind>("NONE");
  const [comment, setComment] = useState("");
  const [keepFiles, setKeepFiles] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!response) return;
    setStartDate(response.proposed_start_date_raw);
    setDeadline(response.proposed_deadline_raw);
    setSum(response.proposed_sum_amount_raw > 0 ? String(Math.round(response.proposed_sum_amount_raw / 100)) : "");
    setVat(response.vat_kind);
    setComment(response.comment);
    setKeepFiles([...response.response_files]);
    setNewFiles([]);
    setBusy(false);
  }, [response]);

  const canSubmit = toKopecks(sum) > 0 && deadline !== "";

  const submit = async () => {
    if (!response || !canSubmit || busy) return;
    if (startDate && startDate > deadline) {
      emitError("Срок начала не может быть позже срока окончания");
      return;
    }
    setBusy(true);
    try {
      await editResponse(response.id, {
        comment: comment.trim(),
        proposed_sum_amount: toKopecks(sum),
        proposed_start_date: startDate,
        proposed_deadline: deadline,
        vat_kind: vat,
        keep_files: keepFiles,
        files: newFiles,
      });
      notifyHaptic("success");
      onSaved();
    } catch (e) {
      emitError(e instanceof Error ? e.message : "Не удалось сохранить отклик");
    } finally {
      setBusy(false);
    }
  };

  const addFiles = (list: FileList | null) => {
    const picked = list ? Array.from(list) : [];
    if (picked.length) setNewFiles((prev) => [...prev, ...picked]);
  };

  const removeKeepFile = (url: string) => setKeepFiles((prev) => prev.filter((u) => u !== url));
  const removeNewFile = (index: number) => setNewFiles((prev) => prev.filter((_, i) => i !== index));

  return {
    startDate,
    setStartDate,
    deadline,
    setDeadline,
    sum,
    setSum,
    vat,
    setVat,
    comment,
    setComment,
    keepFiles,
    newFiles,
    busy,
    canSubmit,
    submit,
    addFiles,
    removeKeepFile,
    removeNewFile,
  };
}
