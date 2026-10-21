import { uploadForm } from "@/shared/api/upload-form";
import type {
  BlitzAuditAttachments,
  BlitzAuditPayload,
  BlitzChecklistFile,
} from "../model/audit-types";
import type { BlitzOrder } from "../model/types";

/** Файл и поле формы, в котором он уходит. */
interface FormFile {
  field: string;
  file: File;
}

/** Отдельные файлы заявки с именами полей формы. */
function attachmentFiles(attachments: BlitzAuditAttachments): FormFile[] {
  const candidates = [
    { field: "company_card", file: attachments.companyCard },
    { field: "opo_certificate", file: attachments.opoCertificate },
    { field: "power_of_attorney", file: attachments.powerOfAttorney },
    { field: "sto_file", file: attachments.stoFile },
  ];

  return candidates.flatMap((candidate) => (
    candidate.file ? [{ field: candidate.field, file: candidate.file }] : []
  ));
}

/** Заявка на аудит: анкета, документы по перечню и отдельные файлы. */
export async function createBlitzAudit(
  payload: BlitzAuditPayload,
  checklist: BlitzChecklistFile[],
  attachments: BlitzAuditAttachments,
): Promise<BlitzOrder> {
  const formFiles = [
    ...checklist.map((entry) => ({ field: "files", file: entry.file })),
    ...attachmentFiles(attachments),
  ];

  /** Собирает форму заново при повторной отправке перечитанных файлов. */
  function createBody(files: File[]): FormData {
    const body = new FormData();

    body.append("payload", JSON.stringify(payload));
    files.forEach((file, index) => body.append(formFiles[index].field, file));
    checklist.forEach((entry) => body.append("items", String(entry.item)));

    return body;
  }

  const response = await uploadForm("/blitz/audit", {
    method: "POST",
    files: formFiles.map((entry) => entry.file),
    createBody,
    errorMessage: "Не удалось отправить заявку на аудит",
  });

  return response.json();
}