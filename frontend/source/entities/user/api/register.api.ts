import { json, send, sendForm } from "@/source/shared/api/request";
import type {
  CustomerRegisterPayload,
  ExpertDocument,
  ExpertRegisterPayload,
  LicenseHolderFiles,
  LicenseHolderRegisterPayload,
  RegisterResponse,
} from "../model/register";
import type { UserRole } from "../model/types";

const REGISTER_FAILED = "Не удалось зарегистрироваться";

/** Регистрация заказчика или исполнителя. Документы исполнителя уходят вместе с анкетой, каждый со своим слотом. */
export async function registerUser(
  payload: CustomerRegisterPayload | ExpertRegisterPayload,
  documents: ExpertDocument[],
): Promise<RegisterResponse> {
  const response = await sendForm(
    "/register/",
    "POST",
    documents.map((document) => document.file),
    () => {
      const body = new FormData();
      body.append("payload", JSON.stringify(payload));
      documents.forEach((document) => {
        body.append("documents", document.file);
        body.append("document_directions", document.slot);
      });
      return body;
    },
    REGISTER_FAILED,
  );
  return response.json();
}

/** Регистрация держателя разрешительных документов вместе с файлами лицензий и выписок. */
export async function registerLicenseHolder(payload: LicenseHolderRegisterPayload, files: LicenseHolderFiles): Promise<RegisterResponse> {
  const attached = [
    { field: "license_file", file: files.license },
    { field: "mining_license_file", file: files.mining },
    { field: "sro_design_file", file: files.sroDesign },
    { field: "sro_survey_file", file: files.sroSurvey },
    { field: "lab_accreditation_file", file: files.lab },
  ];
  const response = await sendForm(
    "/register/license-holder",
    "POST",
    attached.flatMap((item) => (item.file ? [item.file] : [])),
    () => {
      const body = new FormData();
      body.append("payload", JSON.stringify(payload));
      attached.forEach((item) => item.file && body.append(item.field, item.file));
      return body;
    },
    REGISTER_FAILED,
  );
  return response.json();
}

/** Подтвердить почту кодом из письма. После подтверждения сервер открывает сессию. */
export async function confirmEmail(email: string, code: string, role: UserRole | null): Promise<void> {
  await send("/register/confirm-email", json("POST", { email, code, role: role ?? undefined }), "Не удалось подтвердить почту");
}

/** Отправить код подтверждения почты ещё раз. */
export async function resendConfirmationCode(email: string, role: UserRole | null): Promise<void> {
  await send("/register/resend-code", json("POST", { email, role: role ?? undefined }), "Не удалось отправить код");
}
