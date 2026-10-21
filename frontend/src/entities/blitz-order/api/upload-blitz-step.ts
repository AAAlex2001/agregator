import { uploadForm } from "@/shared/api/upload-form";
import type { BlitzOrder } from "../model/types";

/** Поля шага с файлами: замечания, исправления или заключение. */
interface BlitzStepForm {
  files: File[];
  fields: [string, string][];
}

/** Шаг заявки с файлами. */
export async function uploadBlitzStep(
  orderId: number,
  action: string,
  form: BlitzStepForm,
  errorMessage: string,
): Promise<BlitzOrder> {
  /** Собирает форму заново при повторной отправке перечитанных файлов. */
  function createBody(files: File[]): FormData {
    const body = new FormData();

    form.fields.forEach(([name, value]) => body.append(name, value));
    files.forEach((file) => body.append("files", file));

    return body;
  }

  const response = await uploadForm(`/blitz/orders/${orderId}/${action}`, {
    method: "POST",
    files: form.files,
    createBody,
    errorMessage,
  });

  return response.json();
}
